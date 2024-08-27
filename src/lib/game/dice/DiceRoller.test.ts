import { describe, it, expect } from "vitest";
import { DiceRoller } from "./DiceRoller";
import { ExplodingDiceModifier } from "./modifiers/ExplodingDiceModifier/ExplodingDiceModifier";
import { KeepDiceModifier } from "./modifiers/KeepDiceModifier/KeepDiceModifier";
import { MathModifier } from "./modifiers/MathModifier/MathModifier";

describe("DiceStringParser", () => {

  it('should parse a simple dice string "3d6"', () => {
    const result = DiceRoller.parse("3d6");
    expect(result.dice.rolls).toEqual(3);
    expect(result.dice.sides).toEqual(6);
    expect(result.modifiers.length).toEqual(0); // No modifiers
  });

  it('should default to 1 roll if not specified in "d20"', () => {
    const result = DiceRoller.parse("d20");
    expect(result.dice.rolls).toEqual(1); // Default to 1 roll
    expect(result.dice.sides).toEqual(20);
    expect(result.modifiers.length).toEqual(0); // No modifiers
  });

  it('should parse an exploding dice modifier "3d6!"', () => {
    const result = DiceRoller.parse("3d6!");
    expect(result.dice.rolls).toEqual(3);
    expect(result.dice.sides).toEqual(6);
    expect(result.modifiers.some(modifier => modifier instanceof ExplodingDiceModifier)).toBe(true);
  });

  it('should parse a math modifier "3d6+2"', () => {
    const result = DiceRoller.parse("3d6+2");
    expect(result.dice.rolls).toEqual(3);
    expect(result.dice.sides).toEqual(6);
    expect(result.modifiers.some(modifier => modifier instanceof MathModifier)).toBe(true);
  });

  it('should parse a keep highest modifier "4d6kh3"', () => {
    const result = DiceRoller.parse("4d6kh3");
    expect(result.dice.rolls).toEqual(4);
    expect(result.dice.sides).toEqual(6);
    expect(result.modifiers.some(modifier => modifier instanceof KeepDiceModifier)).toBe(true);
  });

  it('should parse a keep lowest modifier "4d6kl3"', () => {
    const result = DiceRoller.parse("4d6kl3");
    expect(result.dice.rolls).toEqual(4);
    expect(result.dice.sides).toEqual(6);
    expect(result.modifiers.some(modifier => modifier instanceof KeepDiceModifier)).toBe(true);
  });

  it('should parse multiple modifiers "4d6+2kh3!"', () => {
    const result = DiceRoller.parse("4d6+2kh3!");
    expect(result.dice.rolls).toEqual(4);
    expect(result.dice.sides).toEqual(6);
    expect(result.modifiers.length).toEqual(3);
    expect(result.modifiers.some(modifier => modifier instanceof MathModifier)).toBe(true);
    expect(result.modifiers.some(modifier => modifier instanceof ExplodingDiceModifier)).toBe(true);
    expect(result.modifiers.some(modifier => modifier instanceof KeepDiceModifier)).toBe(true);
  });

  it('should throw an error for an invalid dice string "3x6"', () => {
    expect(() => DiceRoller.parse("3x6")).toThrowError(
      "Invalid or missing dice component at the start of the string"
    );
  });

  it('should throw an error for unrecognized components in the string "3d6abc"', () => {
    expect(() => DiceRoller.parse("3d6abc")).toThrowError(
      "Unrecognized components in the dice string: abc"
    );
  });

  it('should parse a complex string "3d8+2kh2!"', () => {
    const result = DiceRoller.parse("3d8+2kh2!");
    expect(result.dice.rolls).toEqual(3);
    expect(result.dice.sides).toEqual(8);
    expect(result.modifiers.length).toEqual(3);
    expect(result.modifiers.some(modifier => modifier instanceof MathModifier)).toBe(true);
    expect(result.modifiers.some(modifier => modifier instanceof ExplodingDiceModifier)).toBe(true);
    expect(result.modifiers.some(modifier => modifier instanceof KeepDiceModifier)).toBe(true);
  });

  it('should handle minimum sides "1d2"', () => {
    const result = DiceRoller.parse("1d2");
    expect(result.dice.rolls).toEqual(1);
    expect(result.dice.sides).toEqual(2);
    expect(result.modifiers.length).toEqual(0);
  });
  
  it('should handle large dice sides "1d100"', () => {
    const result = DiceRoller.parse("1d100");
    expect(result.dice.rolls).toEqual(1);
    expect(result.dice.sides).toEqual(100);
    expect(result.modifiers.length).toEqual(0);
  });

  it('should throw an error for unsupported modifier "3d6kq3"', () => {
    expect(() => DiceRoller.parse("3d6kq3")).toThrowError(
      "Unrecognized components in the dice string: kq3"
    );
  });

  it('should throw an error for unsupported multiple keep modifiers "4d6kh3kl2"', () => {
    expect(() => DiceRoller.parse("4d6kh3kl2")).toThrowError(
      "Unrecognized components in the dice string: kl2"
    );
  });
  
});
