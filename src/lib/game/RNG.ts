export interface IRNG {
  getRandomInt(min: number, max: number): number;
}

export class CryptoRNG implements IRNG {
  getRandomInt(min: number, max: number): number {
    if (min > max) throw new Error('min should not be greater than max.');
    if (globalThis.crypto && typeof globalThis.crypto.getRandomValues === 'function') {
      // Use browser's crypto if available
      const array = new Uint32Array(1);
      globalThis.crypto.getRandomValues(array);
      return Math.floor(array[0] / (0xFFFFFFFF + 1) * (max - min + 1)) + min;
    } else {
      throw new Error("No suitable crypto implementation found");
    }
  }
}