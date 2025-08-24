import { Choice, Effect, GameState } from '../model/Types';

function applyEffect(e: Effect, s: GameState, summaries: string[]) {
  switch (e.type) {
    case 'statGain':
      s.stats[e.stat]=(s.stats[e.stat]??0)+e.amount;
      summaries.push(`${e.stat.toUpperCase()} +${e.amount}`);
      break;
    case 'coins':
      s.inventory.coins += e.delta;
      summaries.push(e.delta>=0 ? `Coins +${e.delta}` : `Coins ${e.delta}`);
      break;
    case 'addFlag':
      s.flags[e.flag]=(s.flags[e.flag]??0)+e.amount;
      // Only surface certain meta flags; culture and ally flags stay narrative-only
      if (e.flag==='Suspicion') summaries.push(`Suspicion +${e.amount}`);
      else if (e.flag==='Honorable') summaries.push(`Honor +${e.amount}`);
      else if (e.flag==='Greedy') summaries.push(`Greed +${e.amount}`);
      // Do not log flags like Iron_*, Whispers_*, Ashen_*, Veilbreak_*, Allies_*
      break;
    case 'ally':
      if (!s.allies.includes(e.add)) { s.allies.push(e.add); summaries.push(`Ally gained: ${e.add}`); }
      break;
    case 'scrolls': break;
    case 'item':
      if (e.op==='add' && !s.inventory.items.includes(e.id)) { s.inventory.items.push(e.id); summaries.push(`Item: ${e.id}`); }
      if (e.op==='remove') { s.inventory.items = s.inventory.items.filter(x=>x!==e.id); summaries.push(`Lost item: ${e.id}`); }
      break;
    case 'knowledge':
      if (!s.inventory.knowledge.includes(e.add)) { s.inventory.knowledge.push(e.add); }
      break;
    case 'goto':
      s.chapterId = e.chapterId; s.sceneId = e.sceneId;
      break;
  }
}

export class ChoiceExecutor {
  static apply(choice: Choice, s: GameState, success=true){
    if (choice.oneShotKey) {
      if (s.oneShotLocks[choice.oneShotKey]) throw new Error('That opportunity has passed.');
      s.oneShotLocks[choice.oneShotKey] = true;
    }
    const effects = success ? (choice.effects ?? []) : (choice.onFail ?? []);
    const summaries:string[] = [];
    for (const e of effects) applyEffect(e, s, summaries);
    s.lastLog = summaries;
  }
}