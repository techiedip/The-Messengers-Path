export class RNG {
  private seed:number;
  constructor(seed:number){ this.seed = seed || 1; }
  next(): number { this.seed = (this.seed*1664525+1013904223) % 4294967296; return this.seed/4294967296; }
  chance(p:number){ return this.next() < p; }
}