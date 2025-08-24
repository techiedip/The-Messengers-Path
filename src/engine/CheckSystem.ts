import { GameState, Requirement } from '../model/Types';

export class CheckSystem {
  static test(req: Requirement, s: GameState): boolean {
    switch (req.type) {
      case 'stat': return (s.stats[req.stat] ?? 0) >= req.min;
      case 'coins': return s.inventory.coins >= req.min;
      case 'flagMin': return (s.flags[req.flag] ?? 0) >= req.min;
      case 'clueSum':
        return Object.entries(s.flags).filter(([k])=>k.startsWith(req.prefix))
          .reduce((a, [,v])=>a + (v as number), 0) >= req.min;
      case 'item': return s.inventory.items.includes(req.id);
      default: return false;
    }
  }
  static assert(reqs: Requirement[]|undefined, s: GameState) {
    if (!reqs) return;
    const ok = reqs.every(r => this.test(r, s));
    if (!ok) throw new Error('Requirements not met.');
  }
}