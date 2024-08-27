import type { IRNG } from '$lib/game/RNG';

export interface IDice {
  roll(): number[];
}

export class Dice implements IDice {
  public readonly sides: number;
  public readonly rolls: number;
  private rng: IRNG;

  constructor(rolls: number, sides: number, rng: IRNG) {
    this.rolls = rolls;
    this.sides = sides;
    this.rng = rng;
  }

  roll(): number[] {
    const results: number[] = [];
    for (let i = 0; i < this.rolls; i++) {
      results.push(this.rng.getRandomInt(1, this.sides));
    }
    return results;
  }
}
