import { describe, it, expect } from 'vitest';
import { MathModifier } from '$lib/game/dice/modifiers/MathModifier/MathModifier';
import { MockRNG } from '$lib/mocks/MockRNG'; 
import { CryptoRNG } from '$lib/game/RNG';
import { AdditionStrategy, DivisionStrategy, MultiplicationStrategy, SubtractionStrategy } from './IMathModifier';


describe('MathModifier', () => {
  it('should match and consume a "+" operation', () => {
    const rng = new CryptoRNG();
    const strat = new AdditionStrategy();
    const mathModifier = new MathModifier(rng);
    const result = mathModifier.matchesAndConsume('+5');
    
    expect(result.modifier).toBe(mathModifier);
    expect(result.remainingString).toBe('');
    expect(mathModifier.strategy).toStrictEqual(strat);
    expect(mathModifier.value).toBe(5);
  });

  it('should match and consume a "-" operation', () => {
    const rng = new CryptoRNG();
    const strat = new SubtractionStrategy();
    const mathModifier = new MathModifier(rng);
    const result = mathModifier.matchesAndConsume('-3');
    
    expect(result.modifier).toBe(mathModifier);
    expect(result.remainingString).toBe('');
    expect(mathModifier.strategy).toStrictEqual(strat);
    expect(mathModifier.value).toBe(3);
  });

  it('should match and consume a "*" operation', () => {
    const rng = new CryptoRNG();
    const strat = new MultiplicationStrategy();
    const mathModifier = new MathModifier(rng);
    const result = mathModifier.matchesAndConsume('*2');
    
    expect(result.modifier).toBe(mathModifier);
    expect(result.remainingString).toBe('');
    expect(mathModifier.strategy).toStrictEqual(strat);
    expect(mathModifier.value).toBe(2);
  });

  it('should match and consume a "/" operation', () => {
    const rng = new CryptoRNG();
    const strat = new DivisionStrategy();
    const mathModifier = new MathModifier(rng);
    const result = mathModifier.matchesAndConsume('/4');
    
    expect(result.modifier).toBe(mathModifier);
    expect(result.remainingString).toBe('');
    expect(mathModifier.strategy).toStrictEqual(strat);
    expect(mathModifier.value).toBe(4);
  });

  it('should correctly apply a "+" operation to dice results', () => {
    const rng = new MockRNG([5, 3, 8]);
    const mathModifier = new MathModifier(rng);

    mathModifier.matchesAndConsume('+2');
    const results = mathModifier.apply([5, 3, 8]);

    expect(results).toEqual([7, 5, 10]);
  });

  it('should correctly apply a "-" operation to dice results', () => {
    const rng = new MockRNG([5, 3, 8]);
    const mathModifier = new MathModifier(rng);

    mathModifier.matchesAndConsume('-1');
    const results = mathModifier.apply([5, 3, 8]);

    expect(results).toEqual([4, 2, 7]);
  });

  it('should correctly apply a "*" operation to dice results', () => {
    const rng = new MockRNG([5, 3, 8]);
    const mathModifier = new MathModifier(rng);

    mathModifier.matchesAndConsume('*3');
    const results = mathModifier.apply([5, 3, 8]);

    expect(results).toEqual([15, 9, 24]);
  });

  it('should correctly apply a "/" operation to dice results', () => {
    const rng = new MockRNG([10, 20, 30]);
    const mathModifier = new MathModifier(rng);

    mathModifier.matchesAndConsume('/5');
    expect(mathModifier.strategy).toStrictEqual(new DivisionStrategy());
    expect(mathModifier.value).toBe(5);
    const results = mathModifier.apply([10, 20, 30]);

    expect(results).toEqual([2, 4, 6]); // Integer division results
  });

  it('should return the original dice results if no match is found', () => {
    const mathModifier = new MathModifier(new CryptoRNG());
    const result = mathModifier.matchesAndConsume('invalid');

    expect(result.modifier).toBeNull();
    expect(result.remainingString).toBe('invalid');
  });
});
