// ExplodingDiceModifier.ts

import { ModifierBase } from "../ModifierBase";
import { ModifierType } from "../IModifier";
import { CryptoRNG, type IRNG } from "$lib/game/RNG";
import type { IExplodingModifier } from "./IExplodingModifier";

export class ExplodingDiceModifier extends ModifierBase implements IExplodingModifier {
  readonly type = ModifierType.Exploding;

  protected _explodeOn: number[] = [];
  protected _chainExplosion: boolean = false;
  protected _additionalDice: number = 1;
  protected _maxDepth: number = 5;

  constructor(rng: IRNG = new CryptoRNG(), sides: number) {
    super(rng);
    this._explodeOn = [sides]
  }

  public get explodeOn(): number[] {
    return this._explodeOn;
  }

  public get chainExplosion(): boolean {
    return this._chainExplosion;
  }

  public get additionalDice(): number {
    return this._additionalDice;
  }

  public get maxDepth(): number {
    return this._maxDepth;
  }

  public matchesAndConsume(modifierString: string): { modifier: IExplodingModifier | null; remainingString: string } {
    const explodingRegex = /(!{1,2})(\d+)?(\{([0-9,-]+)\})?/i;
    const match = modifierString.match(explodingRegex);

    if (match) {
      this._chainExplosion = match[1].length === 2; // '!!' means unlimited explosions

      if (match[2]) {
        this._additionalDice = parseInt(match[2], 10);
      }

      if (match[4]) {
        this._explodeOn = this.parseRange(match[4]);
      } else {
        this._explodeOn = []; // Default to exploding on max value
      }

      const remainingString = modifierString.replace(match[0], '').trim();
      return { modifier: this, remainingString };
    }

    return { modifier: null, remainingString: modifierString };
  }

  public apply(diceResults: number[], sides: number): number[] {
    const results: number[] = [...diceResults];
    const triggerValues = this._explodeOn.length > 0 ? this._explodeOn : [sides];

    const checkForExplosion = (roll: number) => triggerValues.includes(roll);

    let newRolls = results.filter(checkForExplosion);
    let depth = 0;

    while (newRolls.length > 0 && (this._chainExplosion || depth < this._maxDepth)) {
      depth++;
      const additionalRolls: number[] = [];

      newRolls.forEach(() => {
        for (let i = 0; i < this._additionalDice; i++) {
          const roll = this.rng.getRandomInt(1, sides);
          results.push(roll);
          if (checkForExplosion(roll)) {
            additionalRolls.push(roll);
          }
        }
      });

      newRolls = additionalRolls;
    }

    return results;
  }

  public getDescription(): string {
    const triggerValues = this._explodeOn.length > 0 ? this._explodeOn.join(", ") : "maximum die value";
    const unlimitedText = this._chainExplosion ? "unlimited" : `up to ${this._maxDepth} times`;
    return `Explodes on [${triggerValues}], rolling ${this._additionalDice} additional dice ${unlimitedText} when triggered.`;
  }
}
