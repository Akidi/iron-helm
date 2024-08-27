import type { IRNG } from "$lib/game/RNG";


export class MockRNG implements IRNG {
  private values: number[];
  private index: number;

  constructor(values: number[]) {
    if (!Array.isArray(values) || values.length === 0) {
      throw new Error("MockRNG requires a non-empty array of values.");
    }
    this.values = values;
    this.index = 0;
  }

  getRandomInt(min: number, max: number): number {
    const value = this.values[this.index % this.values.length];
    this.index++;
    return value;
  }
}