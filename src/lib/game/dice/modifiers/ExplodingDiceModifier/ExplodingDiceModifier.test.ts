import { describe, it, expect, vi } from 'vitest';
import { ExplodingDiceModifier } from '$lib/game/dice/modifiers/ExplodingDiceModifier/ExplodingDiceModifier';
import { MockRNG } from '$lib/mocks/MockRNG';
import type { IRNG } from '$lib/game/RNG';

class TestExplodingDiceModifier extends ExplodingDiceModifier {
  public setExplodeOn(values: number[]): void {
    this._explodeOn = values;
  }

  public setChainExplosion(chainExplosion: boolean): void {
    this._chainExplosion = chainExplosion;
  }

  public setAdditionalDice(count: number): void {
    this._additionalDice = count;
  }

  public setMaxDepth(depth: number): void {
    this._maxDepth = depth;
  }

  constructor(rng: IRNG, sides: number = 6) {
    super(rng, sides);
  }
}

describe('ExplodingDiceModifier', () => {
  it('should match and consume the correct modifier string for a single explosion on max value', () => {
    const rng = new MockRNG([4, 2, 6]);
    const modifier = new TestExplodingDiceModifier(rng);

    const result = modifier.matchesAndConsume('!');
    expect(result.modifier).toBe(modifier);
    expect(result.remainingString).toBe('');
  });

  it('should match and consume the correct modifier string for no explosions', () => {
    const rng = new MockRNG([3, 4, 2]);
    const modifier = new TestExplodingDiceModifier(rng);

    const result = modifier.matchesAndConsume('!{5}'); // Only explode on 5s
    expect(result.modifier).toBe(modifier);
    expect(result.remainingString).toBe('');
  });

  it('should match and consume the correct modifier string for multiple explosions on max value', () => {
    const rng = new MockRNG([6, 3]);
    const modifier = new TestExplodingDiceModifier(rng);

    const result = modifier.matchesAndConsume('!!'); // Multiple explosions
    expect(result.modifier).toBe(modifier);
    expect(result.remainingString).toBe('');
  });

  it('should match and consume the correct modifier string with specified values in the range', () => {
    const rng = new MockRNG([3, 4, 3, 3]);
    const modifier = new TestExplodingDiceModifier(rng);

    const result = modifier.matchesAndConsume('!{4-6}');
    expect(result.modifier).toBe(modifier);
    expect(result.remainingString).toBe('');
  });

  it('should match and consume the correct modifier string for additional dice in explosions', () => {
    const rng = new MockRNG([5, 3, 4]);
    const modifier = new TestExplodingDiceModifier(rng);

    const result = modifier.matchesAndConsume('!3');
    expect(result.modifier).toBe(modifier);
    expect(result.remainingString).toBe('');
    expect(modifier['additionalDice']).toBe(3); // Check if additionalDice is set correctly

    const results = modifier.apply([6], 6);
    expect(results).toEqual([6, 5, 3, 4]); // Explode to add three extra dice
  });

  it('should return null when the modifier string does not match', () => {
    const rng = new MockRNG([5, 3, 4]);
    const modifier = new TestExplodingDiceModifier(rng);

    const result = modifier.matchesAndConsume('invalid');
    expect(result.modifier).toBeNull();
    expect(result.remainingString).toBe('invalid');
  });

  it('should not explode when no matches', () => {
    const rng = new MockRNG([3, 4, 2]);
    const modifier = new TestExplodingDiceModifier(rng);

    modifier.matchesAndConsume('!{5}'); // Only explode on 5s

    const results = modifier.apply([1, 2, 3, 4], 6);
    expect(results).toEqual([1, 2, 3, 4]); // No explosions
  });

  it('should explode on max value', () => {
    const rng = new MockRNG([4, 2, 6]);
    const modifier = new TestExplodingDiceModifier(rng);

    modifier.matchesAndConsume('!');
    const results = modifier.apply([6, 2], 6);

    expect(results).toEqual([6, 2, 4]); // Explode on 6, add a 4
  });

  it('should handle multiple explosions on max value', () => {
    const rng = new MockRNG([6, 3]);
    const modifier = new TestExplodingDiceModifier(rng);

    modifier.matchesAndConsume('!!'); // Single explosion
    const results = modifier.apply([6, 2], 6);

    expect(results).toEqual([6, 2, 6, 3]); // Explode on 6, get 6, explode again for 3
  });

  it('should explode according to specified values in the range', () => {
    const rng = new MockRNG([3, 4, 3, 3]);
    const modifier = new TestExplodingDiceModifier(rng);

    modifier.matchesAndConsume('!{4-6}');
    const results = modifier.apply([4, 6], 6);

    expect(results).toEqual([4, 6, 3, 4, 3]);
  });

  it('should handle additional dice in explosions', () => {
    const rng = new MockRNG([5, 3, 4]);
    const modifier = new TestExplodingDiceModifier(rng);

    modifier.matchesAndConsume('!3');
    const results = modifier.apply([6], 6);

    expect(results).toEqual([6, 5, 3, 4]); // Explode to add three extra dice
  });

  it('should not allow any explosions when maxDepth is 0', () => {
    const rng = new MockRNG([6]);
    const modifier = new TestExplodingDiceModifier(rng);
    modifier.setMaxDepth(0); // Set maxDepth to 0

    modifier.matchesAndConsume('!');
    const results = modifier.apply([6], 6);

    expect(results).toEqual([6]); // No explosions should occur
  });

  it('should allow unlimited explosions with a single "!"', () => {
    const rng = new MockRNG([6, 6, 6, 2]);
    const modifier = new TestExplodingDiceModifier(rng);

    modifier.matchesAndConsume('!');
    const results = modifier.apply([6], 6);

    expect(results).toEqual([6, 6, 6, 6, 2]); // Continue exploding until no more 6s
  });

  it('should stop exploding when maxDepth is reached', () => {
    const rng = new MockRNG([6, 6, 4]);
    const modifier = new TestExplodingDiceModifier(rng);
    modifier.setMaxDepth(2); // Set maxDepth to 2

    modifier.matchesAndConsume('!');
    const results = modifier.apply([6], 6);

    expect(results).toEqual([6, 6, 6]); // Explode twice, then stop
  });

  it('should handle a large number of dice rolls efficiently', () => {
    const rng = new MockRNG([6]);
    const modifier = new TestExplodingDiceModifier(rng);

    modifier.matchesAndConsume('!');
    const largeDicePool = Array(1000).fill(6); // 1000 dice all rolling 6
    const results = modifier.apply(largeDicePool, 6);

    expect(results.length).toEqual(1000 + 1000 * modifier['maxDepth']); // Ensure explosions occurred
  });

  it('should explode on non-standard values', () => {
    const rng = new MockRNG([2, 4, 3, 4, 2, 4, 3, 2, 4]);
    const modifier = new TestExplodingDiceModifier(rng);

    modifier.matchesAndConsume('!{2,4}');
    const results = modifier.apply([1, 2, 3, 4], 6);

    expect(results).toEqual([1, 2, 3, 4, 2, 4, 3, 4, 2, 4, 3]); // Explode on 2 and 4
  });

  it('should trigger 3 explosions for a roll within the range 4-6 with !3{4-6}', () => {
    const rng = new MockRNG([5, 5, 5]); // Simulate three explosions
    const modifier = new TestExplodingDiceModifier(rng);
    modifier.setMaxDepth(1);

    modifier.matchesAndConsume('!3{4-6}');
    const results = modifier.apply([4], 6);

    expect(results).toEqual([4, 5, 5, 5]); // Verify that three explosions occurred
  });

  it('should trigger 2 explosions for each roll of 2, 4, or 6 with !2{2,4,6}', () => {
    const rng = new MockRNG([4, 2, 4, 6, 3, 1]); // Simulate explosions
    const modifier = new TestExplodingDiceModifier(rng);
    modifier.setMaxDepth(1)

    modifier.matchesAndConsume('!2{2,4,6}');
    const results = modifier.apply([2, 4, 6], 6);

    expect(results).toEqual([2, 4, 6, 4, 2, 4, 6, 3, 1]);
  });

  it('should trigger explosions on all dice rolls up to maxDepth', () => {
    const rng = new MockRNG([2, 3, 4, 5, 6]);
    const modifier = new TestExplodingDiceModifier(rng);

    modifier.matchesAndConsume('!{1-6}');
    const results = modifier.apply([1, 2, 3, 4, 5, 6], 6);

    // Ensure explosions occur but do not exceed 5 levels deep
    expect(results.length).toEqual(6 + 6 * modifier['maxDepth']);
  });
});
