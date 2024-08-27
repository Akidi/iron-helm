// IModifier.ts
export interface IModifier {
  readonly type: ModifierType;
  matchesAndConsume(modifierString: string): { modifier: IModifier | null; remainingString: string };
  apply(diceResults: number[], sides: number): number[];
  getDescription(): string;
}

// Enum to identify modifier types
export enum ModifierType {
  Exploding = "Exploding",
  Keep = "Keep",
  Math = "Math",
  // Add other types as needed
}
