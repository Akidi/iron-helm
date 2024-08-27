import { describe, it, expect, vi } from 'vitest';
import { Dice } from '$lib/game/dice/Dice';
import { MockRNG } from '$lib/mocks/MockRNG';

describe('Dice', () => {
  it('should initialize with correct properties', () => {
    const rng = new MockRNG([1, 2, 3]);
    const dice = new Dice(3, 6, rng);
    expect(dice.sides).toBe(6);
    expect(dice.rolls).toBe(3);
  });

  it('should roll the correct number of times', () => {
    const rng = new MockRNG([1, 2, 3]);
    const dice = new Dice(3, 6, rng);
    const results = dice.roll();
    expect(results).toHaveLength(3);
  });

  it('should produce results within the correct range', () => {
    const rng = new MockRNG([1, 2, 3]);
    const dice = new Dice(3, 6, rng);
    const results = dice.roll();
    results.forEach(result => {
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(6);
    });
  });

  it('should produce the expected results based on mocked RNG', () => {
    const rng = new MockRNG([4, 5, 6]);
    const dice = new Dice(3, 6, rng);
    const results = dice.roll();
    expect(results).toEqual([4, 5, 6]);
  });

  it('should handle rolls exceeding the mock value array size', () => {
    const rng = new MockRNG([4, 5]);
    const dice = new Dice(4, 6, rng);
    const results = dice.roll();
    expect(results).toEqual([4, 5, 4, 5]); // The mock repeats its values
  });
});
