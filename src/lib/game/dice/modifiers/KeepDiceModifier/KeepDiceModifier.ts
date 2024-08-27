// KeepModifier.ts

import { ModifierBase } from "../ModifierBase";
import { ModifierType } from "../IModifier";
import { CryptoRNG, type IRNG } from "$lib/game/RNG";
import type { IKeepModifier } from "./IKeepModifier";

export class KeepDiceModifier extends ModifierBase implements IKeepModifier {
  readonly type = ModifierType.Keep;

  protected _keepCount: number = 1;
  protected _keepHighest: boolean = true;

  constructor(rng: IRNG = new CryptoRNG()) {
    super(rng);
  }

  public get keepCount(): number {
    return this._keepCount;
  }

  public get keepHighest(): boolean {
    return this._keepHighest;
  }

  public matchesAndConsume(modifierString: string): { modifier: IKeepModifier | null; remainingString: string } {
    const keepRegex = /k([hl])?(\d+)/i;
    const match = modifierString.match(keepRegex);

    if (match) {
      this._keepHighest = match[1]?.toLowerCase() !== 'l';
      this._keepCount = parseInt(match[2], 10);

      const remainingString = modifierString.replace(match[0], '').trim();
      return { modifier: this, remainingString };
    }

    return { modifier: null, remainingString: modifierString };
  }

  public apply(diceResults: number[]): number[] {
    const sortedResults = [...diceResults].sort((a, b) => this._keepHighest ? b - a : a - b);
    return sortedResults.slice(0, this._keepCount);
  }

  public getDescription(): string {
    const type = this._keepHighest ? 'highest' : 'lowest';
    return `Keep the ${this._keepCount} ${type} dice.`;
  }
}
