export enum Stat { Wit='wit', Charm='charm', Might='might' }
export type StatBlock = Record<Stat, number>;
export type Ally = 'Iron'|'Whispers'|'Ashen';
export type Flag = string; // dynamic flags (Suspicion, Iron_*, etc.)
