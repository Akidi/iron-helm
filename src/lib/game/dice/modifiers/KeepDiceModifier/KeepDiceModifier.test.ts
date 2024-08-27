import { describe, it, expect } from 'vitest';
import { KeepDiceModifier } from '$lib/game/dice/modifiers/KeepDiceModifier/KeepDiceModifier'; 
import { MockRNG } from '$lib/mocks/MockRNG'; // Assuming you place MockRNG in the same directory or adjust accordingly

class TestKeepDiceModifier extends KeepDiceModifier {
  public setKeepCount(count: number): void {
    this._keepCount = count;
  }

  public setKeepHighest(highest: boolean): void {
    this._keepHighest = highest;
  }
}

describe('keepDiceModifier', () => {
  it('should match and consume a keep highest modifier', () => {
    const keepDiceModifier = new TestKeepDiceModifier();
    const result = keepDiceModifier.matchesAndConsume('kh3');
    
    expect(result.modifier).toBe(keepDiceModifier);
    expect(result.remainingString).toBe('');
    expect(keepDiceModifier.keepHighest).toBe(true);
    expect(keepDiceModifier.keepCount).toBe(3);
  });

  it('should match and consume a keep lowest modifier', () => {
    const keepDiceModifier = new TestKeepDiceModifier();
    const result = keepDiceModifier.matchesAndConsume('kl2');

    expect(result.modifier).toBe(keepDiceModifier);
    expect(result.remainingString).toBe('');
    expect(keepDiceModifier.keepHighest).toBe(false);
    expect(keepDiceModifier.keepCount).toBe(2);
  });

  it('should correctly keep the highest dice results', () => {
    const rng = new MockRNG([5, 3, 8, 1, 4]);
    const keepDiceModifier = new TestKeepDiceModifier(rng);

    keepDiceModifier.matchesAndConsume('kh2');
    const results = keepDiceModifier.apply([5, 3, 8, 1, 4]);

    expect(results).toEqual([8, 5]);
  });

  it('should correctly keep the lowest dice results', () => {
    const rng = new MockRNG([5, 3, 8, 1, 4]);
    const keepDiceModifier = new TestKeepDiceModifier(rng);

    keepDiceModifier.matchesAndConsume('kl2');
    const results = keepDiceModifier.apply([5, 3, 8, 1, 4]);

    expect(results).toEqual([1, 3]);
  });

  it('should handle keeping more dice than rolled', () => {
    const rng = new MockRNG([5, 3]);
    const keepDiceModifier = new TestKeepDiceModifier(rng);

    keepDiceModifier.matchesAndConsume('kh5');
    const results = keepDiceModifier.apply([5, 3]);

    expect(results).toEqual([5, 3]);
  });

  it('should handle the case where no valid match is found', () => {
    const keepDiceModifier = new TestKeepDiceModifier();
    const result = keepDiceModifier.matchesAndConsume('invalid');

    expect(result.modifier).toBeNull();
    expect(result.remainingString).toBe('invalid');
  });
});
