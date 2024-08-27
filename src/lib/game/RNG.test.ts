import { describe, it, expect } from 'vitest';
import { CryptoRNG } from '$lib/game/RNG'; // Adjust the path as necessary

describe('CryptoRNG', () => {
  it('should return values within the specified range', () => {
    const rng = new CryptoRNG();

    for (let i = 0; i < 1000; i++) {
      const value = rng.getRandomInt(1, 6);
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(6);
    }
  });

  it('should return the min value when min and max are the same', () => {
    const rng = new CryptoRNG();

    const value = rng.getRandomInt(5, 5);
    expect(value).toBe(5);
  });

  it('should handle large ranges correctly', () => {
    const rng = new CryptoRNG();

    for (let i = 0; i < 1000; i++) {
      const value = rng.getRandomInt(1, 1000000);
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(1000000);
    }
  });

  it('should handle small ranges correctly', () => {
    const rng = new CryptoRNG();

    for (let i = 0; i < 1000; i++) {
      const value = rng.getRandomInt(1, 2);
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(2);
    }
  });

  it('should throw an error if min is greater than max', () => {
    const rng = new CryptoRNG();

    expect(() => rng.getRandomInt(10, 5)).toThrowError('min should not be greater than max');
  });

  it('should handle a large number of calls efficiently', () => {
    const rng = new CryptoRNG();

    for (let i = 0; i < 100000; i++) {
      const value = rng.getRandomInt(1, 100);
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(100);
    }
  });
});
