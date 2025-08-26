import chalk from 'chalk';
import { GameState, Scene, Chapter } from '../model/Types';

function friendlyTitle(s: GameState): string {
  const id = s.sceneId;
  const map: Record<string,string> = {
    'sab_scene':'The Sabotage',
    'storm_scene':'The Storm',
    'stow_scene':'The Stowaway',
    'arrival':'Arrival',
    'training':'Training Grounds',
    'hall':'The Great Hall',
    'palace':'Palace of Trade',
    'depart':'Departure',
    'return':'Homecoming',
    'war':'The Battlefield',
    'trial_random':"Captain's Trial"
  };
  if (map[id]) return map[id];
  return id.replace(/_/g,' ').replace(/\b\w/g, (m)=>m.toUpperCase());
}

function getChapterTitle(chapterId: string, chapters: Record<string, Chapter>): string {
  const ch = chapters[chapterId];
  return ch ? ch.title : chapterId.replace(/_/g,' ').replace(/\b\w/g, (m)=>m.toUpperCase());
}

function getFullTitle(scene: Scene, s: GameState, chapters: Record<string, Chapter>): string {
  const chapterTitle = getChapterTitle(s.chapterId, chapters);
  const sceneTitle = scene.title || friendlyTitle(s);
  return `${chapterTitle}: ${sceneTitle}`;
}


export class Renderer {
  static printScene(scene: Scene, s: GameState, chapters: Record<string, Chapter>) {
    console.clear();
    const title = getFullTitle(scene, s, chapters);
    console.log(chalk.cyanBright(`\n== ${title} ==\n`));
    console.log(scene.text);
    if (s.lastLog && s.lastLog.length) { console.log(chalk.green(`\nRecent: ${s.lastLog.join(' • ')}`)); s.lastLog = []; }
    if (scene.npcs?.length) {
      console.log(chalk.yellow('\nPeople here:'));
      for (const n of scene.npcs) console.log(`- ${n.name}: ${n.desc}`);
    }
    console.log(chalk.magenta(`\nStats: Wit ${s.stats.wit??0} | Charm ${s.stats.charm??0} | Might ${s.stats.might??0} | Coins ${s.inventory.coins}`));
  }

  static listChoices(list:{id:string,label:string}[]) {
    console.log('\nChoices:');
    list.forEach((c,i)=>console.log(`${i+1}. ${c.label}`));
  }

  static fail(msg: string){ console.log(chalk.red(`\n${msg}`)); }

  static testerHint(){
    console.log('\n[tester shortcuts: :s to save, :l to load, :q to quit]');
  }
}
