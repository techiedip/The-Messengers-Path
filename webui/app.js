
const Stat = { Wit:'wit', Charm:'charm', Might:'might' };

const state = {
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

// RNG (LCG)
class RNG {
  constructor(seed){ this.seed = seed || 1; }
  next(){ this.seed = (this.seed*1664525+1013904223) % 4294967296; return this.seed/4294967296; }
  int(max){ return Math.floor(this.next()*max); }
}
const rng = new RNG(state.rngSeed);

// Load chapters
const chapters = {};
async function loadContent() {
  const files = [
    'prologue.json','ch1_crossing.json','ch_isle_select.json',
    'ch2_iron.json','ch3_whispers.json','ch4_ashen.json','ch5_veilbreak.json','ch6_convergence.json'
  ];
  for (const f of files) {
    const res = await fetch(`content/${f}`);
    const j = await res.json();
    chapters[j.id] = j;
  }
}

function currentScene(){
  const ch = chapters[state.chapterId];
  if (!ch) throw new Error('Missing chapter '+state.chapterId);
  const sc = ch.scenes.find(s=>s.id===state.sceneId);
  if (!sc) throw new Error('Missing scene '+state.sceneId);
  return sc;
}

// Requirements
function flagSum(prefix){
  return Object.entries(state.flags).filter(([k])=>k.startsWith(prefix))
    .reduce((a, [,v])=>a+(v??0),0);
}
function testReq(req){
  switch(req.type){
    case 'stat': return (state.stats[req.stat] ?? 0) >= req.min;
    case 'coins': return state.inventory.coins >= req.min;
    case 'flagMin': return (state.flags[req.flag] ?? 0) >= req.min;
    case 'clueSum': return flagSum(req.prefix) >= req.min;
    case 'item': return state.inventory.items.includes(req.id);
    case 'notVisited': return !state.visitedIsles.includes(req.isle);
    default: return false;
  }
}
function canChoose(c){
  return (c.requirements ?? []).every(testReq);
}

// Effects
function applyEffect(e){
  switch(e.type){
    case 'statGain':
      state.stats[e.stat]=(state.stats[e.stat]??0)+e.amount;
      state.lastLog.push(`${e.stat.toUpperCase()} +${e.amount}`);
      break;
    case 'coins':
      state.inventory.coins += e.delta;
      state.lastLog.push(e.delta>=0 ? `Coins +${e.delta}` : `Coins ${e.delta}`);
      break;
    case 'addFlag':
      state.flags[e.flag]=(state.flags[e.flag]??0)+e.amount;
      // Only surface certain meta flags; culture and ally flags stay narrative-only
      if (e.flag==='Suspicion') state.lastLog.push(`Suspicion +${e.amount}`);
      else if (e.flag==='Honorable') state.lastLog.push(`Honor +${e.amount}`);
      else if (e.flag==='Greedy') state.lastLog.push(`Greed +${e.amount}`);
      // Do not log flags like Iron_*, Whispers_*, Ashen_*, Veilbreak_*, Allies_*
      break;
    case 'ally':
      if (!state.allies.includes(e.add)) { state.allies.push(e.add); state.lastLog.push(`Ally gained: ${e.add}`); }
      break;
    case 'item':
      if (e.op==='add' && !state.inventory.items.includes(e.id)) { state.inventory.items.push(e.id); state.lastLog.push(`Item: ${e.id}`); }
      if (e.op==='remove') { state.inventory.items = state.inventory.items.filter(x=>x!==e.id); state.lastLog.push(`Lost item: ${e.id}`); }
      break;
    case 'knowledge':
      if (!state.inventory.knowledge.includes(e.add)) { state.inventory.knowledge.push(e.add); }
      break;
    case 'goto':
      state.chapterId = e.chapterId; state.sceneId = e.sceneId;
      break;
    case 'visitIsle':
      if (!state.visitedIsles.includes(e.isle)) { state.visitedIsles.push(e.isle); }
      break;
  }
}

function applyChoice(choice){
  if (choice.oneShotKey){
    if (state.oneShotLocks[choice.oneShotKey]) throw new Error('That opportunity has passed.');
    state.oneShotLocks[choice.oneShotKey] = true;
  }
  const ok = canChoose(choice);
  const effects = ok ? (choice.effects ?? []) : (choice.onFail ?? []);
  for (const e of effects) applyEffect(e);
  if (choice.next) state.sceneId = choice.next;
  state.history.push(choice.id);
}

// Friendly titles
function friendlyTitle(scene){
  const map = {
    'sab_scene':'The Sabotage','storm_scene':'The Storm','stow_scene':'The Stowaway',
    'arrival':'Arrival','training':'Training Grounds','hall':'The Great Hall','palace':'Palace of Trade',
    'depart':'Departure','return':'Homecoming','trial_random':"Captain's Trial",'war':'The Battlefield'
  };
  return scene.title || map[state.sceneId] || state.sceneId.replace(/_/g,' ').replace(/\b\w/g,m=>m.toUpperCase());
}

function getChapterTitle(){
  const ch = chapters[state.chapterId];
  return ch ? ch.title : state.chapterId.replace(/_/g,' ').replace(/\b\w/g,m=>m.toUpperCase());
}

function getFullTitle(scene){
  const chapterTitle = getChapterTitle();
  const sceneTitle = friendlyTitle(scene);
  return `${chapterTitle}: ${sceneTitle}`;
}

// Randomize Captain's trial
function maybeRouteRandomTrial(){
  if (state.chapterId==='ch1_crossing' && state.sceneId==='trial_random'){
    const picks = ['sab_scene','storm_scene','stow_scene'];
    state.sceneId = picks[rng.int(picks.length)];
  }
}

// Render
const $term = document.getElementById('term');
const $stats = document.getElementById('stats');
const $cmd = document.getElementById('cmd');
const $enter = document.getElementById('enter');

function clearTerm(){ $term.innerHTML=''; }
function line(html){ const div=document.createElement('div'); div.className='line'; div.innerHTML=html; $term.appendChild(div); $term.scrollTop=$term.scrollHeight; }
function hr(){ line('<span class="small">—</span>'); }

function render(){
  maybeRouteRandomTrial();
  const scene = currentScene();
  clearTerm();
  line(`<h2>${getFullTitle(scene)}</h2>`);
  line(scene.text.replace(/\\n/g,'<br/>').replace(/\n/g,'<br/>'));
  if (state.lastLog && state.lastLog.length){
    line(`<div class="flash">Recent: ${state.lastLog.join(' • ')}</div>`);
    state.lastLog = [];
  }
  if (scene.npcs && scene.npcs.length){
    const npcs = scene.npcs.map(n=>`- <strong>${n.name}</strong>: ${n.desc}`).join('<br/>');
    line(`<div class="npcs">${npcs}</div>`);
  }
  hr();
  const avail = (scene.choices||[]).filter(canChoose);
  state._visibleChoices = avail; // keep for input
  
  // Handle game end case
  if (avail.length === 0) {
    line('<div class="flash">The story ends here.</div>');
    const restartChoice = {
      id: 'restart_game',
      label: 'Return to the beginning',
      effects: []
    };
    avail.push(restartChoice);
    state._visibleChoices = avail;
  }
  
  avail.forEach((c,i)=>{
    const div = document.createElement('div');
    div.className = 'choice';
    div.innerHTML = `<strong>${i+1}.</strong> ${c.label}`;
      div.onclick = ()=>{
        pick(i+1);
        $cmd.value='';
      };
    $term.appendChild(div);
  });
  // stats
  $stats.textContent = `Wit ${state.stats.wit??0} • Charm ${state.stats.charm??0} • Might ${state.stats.might??0} • Coins ${state.inventory.coins} • Allies ${state.flags['Allies']??0}`;
}

function pick(n){
  const idx = n-1;
  const list = state._visibleChoices || [];
  if (idx<0 || idx>=list.length) return;
  try {
    const choice = list[idx];
    
    // Handle restart game choice
    if (choice.id === 'restart_game') {
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
      render();
      return;
    }
    
    applyChoice(choice);
    // Add choice text to lastLog so it appears in the "Recent" section
    if (choice.text) {
      state.lastLog.push(choice.text);
    }
    render();
  } catch (e){
    line(`<div class="bad">${e.message||'Action failed.'}</div>`);
  }
}

$enter.onclick = ()=>{
  const n = parseInt($cmd.value,10);
    if (!Number.isNaN(n)) {
      pick(n);
      $cmd.value='';
    }
  $cmd.focus();
};
$cmd.addEventListener('keydown', (e)=>{
  if (e.key==='Enter') $enter.click();
});
window.addEventListener('keydown', (e)=>{
  // Only allow reset/randomize via keyboard
  if (e.key==='r' || e.key==='R'){
    Object.assign(state, {chapterId:'prologue',sceneId:'square',stats:{wit:0,charm:0,might:0},flags:{},inventory:{coins:1,items:[],knowledge:[]},allies:[],visitedIsles:[],rngSeed:42,history:[],oneShotLocks:{},isGameOver:false,lastLog:[]});
    render();
  }
  if (e.key==='n' || e.key==='N'){
    state.rngSeed = Math.floor(Math.random()*1e9); rng.seed = state.rngSeed; render();
  }
});


(async function() {
  await loadContent();
  render();
})();
