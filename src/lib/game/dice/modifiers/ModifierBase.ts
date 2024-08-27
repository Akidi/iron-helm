import { CryptoRNG, type IRNG } from "$lib/game/RNG";
import type { IModifier, ModifierType } from "./IModifier";

export abstract class ModifierBase implements IModifier {
  protected rng: IRNG;
  abstract type: ModifierType;

  constructor(rng: IRNG = new CryptoRNG()) {
    this.rng = rng;
  }

  abstract matchesAndConsume(modifierString: string): { modifier: IModifier | null, remainingString: string };
  abstract apply(diceResults: number[], sides: number): number[];
  abstract getDescription(): string;

  protected parseRange(rangeString: string): number[] {
    const result: number[] = [];
    const parts = rangeString.split(',');

    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number);
        for (let i = start; i <= end; i++) {
          result.push(i);
        }
      } else {
        result.push(parseInt(part));
      }
    }

    return result;
  }
}
