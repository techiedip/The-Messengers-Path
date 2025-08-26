import { Stat, StatBlock, Ally } from './Enums.js';

export interface Inventory { coins:number; items:string[]; knowledge:string[]; }
export interface Scrolls { total:number; remaining:number; }

export interface GameState {
  chapterId:string;
  sceneId:string;
  stats: StatBlock;
  flags: Record<string, number>;
  inventory: Inventory;
  allies: Ally[];
  visitedIsles: string[];
  rngSeed: number;
  history: string[];
  oneShotLocks: Record<string, boolean>;
  isGameOver: boolean;
  lastLog?: string[];
}

export interface RequirementStat { type:'stat'; stat: Stat; min:number; }
export interface RequirementCoins { type:'coins'; min:number; }
export interface RequirementFlagMin { type:'flagMin'; flag:string; min:number; }
export interface RequirementClueSum { type:'clueSum'; prefix:string; min:number; }
export interface RequirementItem { type:'item'; id:string; }
export interface RequirementNotVisited { type:'notVisited'; isle:string; }
export type Requirement = RequirementStat|RequirementCoins|RequirementFlagMin|RequirementClueSum|RequirementItem|RequirementNotVisited;

export interface EffectStatGain { type:'statGain'; stat: Stat; amount:number; }
export interface EffectCoins { type:'coins'; delta:number; }
export interface EffectAddFlag { type:'addFlag'; flag:string; amount:number; }
export interface EffectAlly { type:'ally'; add: 'Iron'|'Whispers'|'Ashen'; }
export interface EffectScrolls { type:'scrolls'; delta:number; }
export interface EffectItem { type:'item'; op:'add'|'remove'; id:string; }
export interface EffectKnowledge { type:'knowledge'; add:string; }
export interface EffectGoto { type:'goto'; chapterId:string; sceneId:string; }
export interface EffectVisitIsle { type:'visitIsle'; isle:string; }
export type Effect = EffectStatGain|EffectCoins|EffectAddFlag|EffectAlly|EffectScrolls|EffectItem|EffectKnowledge|EffectGoto|EffectVisitIsle;

export interface Choice {
  id:string; label:string;
  requirements?: Requirement[];
  effects?: Effect[];
  onFail?: Effect[];
  oneShotKey?: string;
  next?: string;
  text?: string;
}

export interface NPC { id:string; name:string; desc:string; }

export interface Scene { id:string; text:string; title?:string; npcs?:NPC[]; choices:Choice[]; }
export interface Chapter { id:string; title:string; scenes:Scene[]; }
