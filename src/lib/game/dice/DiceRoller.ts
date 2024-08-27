import { KeepDiceModifier } from "./modifiers/KeepDiceModifier/KeepDiceModifier";
import { MathModifier } from "./modifiers/MathModifier/MathModifier";
import { Dice } from "./Dice";
import { type IRNG, CryptoRNG } from "../RNG";
import { ExplodingDiceModifier } from "./modifiers/ExplodingDiceModifier/ExplodingDiceModifier";
import type { IModifier } from "./modifiers/IModifier";

export class DiceRoller {
  static roll(diceString: string, rng: IRNG = new CryptoRNG()): number[] {
    const { dice, modifiers } = DiceRoller.parse(diceString, rng);
    let results = dice.roll();

    // Apply all modifiers to the roll results
    modifiers.forEach(modifier => {
      results = modifier.apply(results, dice.sides);
    });

    return results;
  }

  static parse(diceString: string, rng: IRNG = new CryptoRNG()): { dice: Dice, modifiers: IModifier[] } {
    const diceRegex = /^(\d*)d(\d+)/i;
    const diceMatch = diceString.match(diceRegex);

    if (!diceMatch) {
      throw new Error("Invalid or missing dice component at the start of the string");
    }

    const rolls = diceMatch[1] ? parseInt(diceMatch[1]) : 1;
    const sides = parseInt(diceMatch[2]);
    let remainingString = diceString.replace(diceMatch[0], '').trim();

    const dice = new Dice(rolls, sides, rng);
    const modifiers: IModifier[] = [];

    const potentialModifiers: IModifier[] = [
      new ExplodingDiceModifier(rng, sides),
      new MathModifier(rng),
      new KeepDiceModifier(rng),
    ];

    // Let each modifier try to match and consume its part of the string
    potentialModifiers.forEach(modifier => {
      const result = modifier.matchesAndConsume(remainingString);
      if (result.modifier) {
        modifiers.push(result.modifier);
        remainingString = result.remainingString;
      }
    });

    // Handle any leftover string (optional)
    if (remainingString.length > 0) {
      throw new Error(`Unrecognized components in the dice string: ${remainingString}`);
    }

    return { dice, modifiers };
  }
}
