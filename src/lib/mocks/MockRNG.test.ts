import { describe, it, expect } from 'vitest';
import { MockRNG } from './MockRNG'; // Adjust the path as necessary

describe('MockRNG', () => {
  it('should return the correct sequence of numbers', () => {
    const mockValues = [4, 2, 7, 9];
    const rng = new MockRNG(mockValues);

    expect(rng.getRandomInt(1, 10)).toBe(4);
    expect(rng.getRandomInt(1, 10)).toBe(2);
    expect(rng.getRandomInt(1, 10)).toBe(7);
    expect(rng.getRandomInt(1, 10)).toBe(9);
  });

  it('should loop back to the start of the array when exhausted', () => {
    const mockValues = [3, 6];
    const rng = new MockRNG(mockValues);

    expect(rng.getRandomInt(1, 10)).toBe(3);
    expect(rng.getRandomInt(1, 10)).toBe(6);
    expect(rng.getRandomInt(1, 10)).toBe(3);  // Loops back
    expect(rng.getRandomInt(1, 10)).toBe(6);  // Loops back
  });

  it('should work correctly even if only one value is provided', () => {
    const mockValues = [5];
    const rng = new MockRNG(mockValues);

    expect(rng.getRandomInt(1, 10)).toBe(5);
    expect(rng.getRandomInt(1, 10)).toBe(5);  // Always returns 5
    expect(rng.getRandomInt(1, 10)).toBe(5);
  });

  it('should handle an empty array gracefully', () => {
    expect(() => new MockRNG([])).toThrow('MockRNG requires a non-empty array of values.'); // Replace with the appropriate error
  });
});
