import fs from 'node:fs';
import path from 'node:path';
import { ContentIndex, SceneRouter } from './engine/SceneRouter.js';
import { Renderer } from './io/Renderer.js';
import { askChoiceOrCommand } from './io/Input.js';
import { Chapter, GameState } from './model/Types.js';
import { RNG } from './engine/RNG.js';

function loadChapter(file:string): Chapter {
  const raw = fs.readFileSync(path.resolve(file),'utf-8');
  return JSON.parse(raw);
}

const idx = new ContentIndex();
idx.addChapter(loadChapter('src/content/prologue.json'));
idx.addChapter(loadChapter('src/content/ch1_crossing.json'));
idx.addChapter(loadChapter('src/content/ch_isle_select.json'));
idx.addChapter(loadChapter('src/content/ch2_iron.json'));
idx.addChapter(loadChapter('src/content/ch3_whispers.json'));
idx.addChapter(loadChapter('src/content/ch4_ashen.json'));
idx.addChapter(loadChapter('src/content/ch5_veilbreak.json'));
idx.addChapter(loadChapter('src/content/ch6_convergence.json'));

const state: GameState = {
  chapterId: 'prologue',
  sceneId: 'square',
  stats: { wit:0, charm:0, might:0 },
  flags: {},
  inventory: { coins: 1, items: [], knowledge: [] },
  allies: [],
  visitedIsles: [],
  rngSeed: 42,
  history: [],
  oneShotLocks: {},
  isGameOver: false,
  lastLog: []
};

const router = new SceneRouter(state, idx);
const rng = new RNG(state.rngSeed || 42);

const SAVES_DIR = 'saves';
function ensureSavesDir() {
  try {
    fs.mkdirSync(SAVES_DIR, { recursive: true });
  } catch (_e) {
    // Intentionally ignore errors for idempotency (directory may already exist)
    return;
  }
}
function saveState(filename='last_save.json'){
  ensureSavesDir();
  fs.writeFileSync(path.join(SAVES_DIR, filename), JSON.stringify(state, null, 2), 'utf-8');
  console.log('\n[Saved to ' + path.join(SAVES_DIR, filename) + ']');
}
function loadState(filename='last_save.json'){
  const p = path.join(SAVES_DIR, filename);
  if (!fs.existsSync(p)) { console.log('\n[No save at ' + p + ']'); return; }
  try {
    const loaded = JSON.parse(fs.readFileSync(p, 'utf-8'));
    Object.assign(state, loaded);
    console.log('\n[Loaded from ' + p + ']');
  } catch (e: unknown) {
    let msg = 'Unknown error';
    if (typeof e === 'object' && e !== null && 'message' in e && typeof (e as { message?: unknown }).message === 'string') {
      msg = (e as { message: string }).message;
    } else {
      msg = String(e);
    }
    console.log('\n[Failed to load save: ' + msg + ']');
  }
}


function maybeRouteRandomTrial() {
  if (state.chapterId === 'ch1_crossing' && state.sceneId === 'trial_random') {
    const picks = ['sab_scene','storm_scene','stow_scene'];
    const idxPick = Math.floor(rng.next() * picks.length);
    state.sceneId = picks[idxPick];
  }
}


const SMOKE = process.env.SMOKE === '1';

async function main(){
  let steps = 0;

  while (!state.isGameOver) {
    maybeRouteRandomTrial();

    maybeRouteRandomTrial();
    const scene = router.current();
    Renderer.printScene(scene, state, idx.chapters);
    const choices = router.availableChoices().map(c=>({id:c.id,label:c.label}));
    if (choices.length===0) { 
      console.log('\n[The story ends here.]');
      console.log('\nChoices:');
      console.log('1. Return to the beginning');
      console.log('2. Quit game');
      
      const res = await askChoiceOrCommand(2);
      if (res.kind==='choice') {
        if (res.n === 1) {
          // Reset to beginning
          Object.assign(state, {
            chapterId: 'prologue',
            sceneId: 'square',
            stats: { wit:0, charm:0, might:0 },
            flags: {},
            inventory: { coins: 1, items: [], knowledge: [] },
            allies: [],
            visitedIsles: [],
            rngSeed: 42,
            history: [],
            oneShotLocks: {},
            isGameOver: false,
            lastLog: []
          });
          continue;
        } else {
          break;
        }
      } else if (res.kind==='cmd') {
        const c = res.cmd;
        if (c==='s' || c==='save') { saveState(res.arg || 'last_save.json'); continue; }
        if (c==='l' || c==='load') { loadState(res.arg || 'last_save.json'); continue; }
        if (c==='q' || c==='quit') { console.log('\n[Goodbye]'); break; }
      }
      continue;
    }
    if (SMOKE) {
      const chosen = choices[0].id;
      try { router.applyChoice(chosen); } catch (e) {
        const msg = (typeof e === 'object' && e && 'message' in e) ? (e as { message?: string }).message : String(e);
        console.error('SMOKE error:', msg);
        process.exit(1);
      }
      steps++;
      if (steps >= 12) { console.log('\n[SMOKE finished 12 steps successfully]'); process.exit(0); }
      continue;
    }
    Renderer.listChoices(choices);
    Renderer.testerHint();
    const res = await askChoiceOrCommand(choices.length);
    if (res.kind==='cmd') {
      const c = res.cmd;
      if (c==='s' || c==='save') { saveState(res.arg || 'last_save.json'); continue; }
      if (c==='l' || c==='load') { loadState(res.arg || 'last_save.json'); continue; }
      if (c==='q' || c==='quit') { console.log('\n[Goodbye]'); break; }
    } else if (res.kind==='choice') {
      const n = res.n;
      const chosen = choices[n-1].id;
      const choiceObj = router.current().choices.find(c => c.id === chosen);
      try { 
        router.applyChoice(chosen);
        // Display choice text if available
        if (choiceObj?.text) {
          console.log(`\n${choiceObj.text}`);
        }
      }
      catch (e: unknown) {
        let msg = 'Action failed.';
        if (typeof e === 'object' && e !== null && 'message' in e && typeof (e as { message?: unknown }).message === 'string') {
          msg = (e as { message: string }).message;
        }
        Renderer.fail(msg ?? 'Action failed.');
      }
    }
  }
}

main().catch(err=>{ console.error(err); process.exit(1); });
