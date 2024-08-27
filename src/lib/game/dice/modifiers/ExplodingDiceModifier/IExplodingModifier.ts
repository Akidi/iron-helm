import type { IModifier, ModifierType } from "../IModifier";

export interface IExplodingModifier extends IModifier {
  readonly type: ModifierType.Exploding;
  readonly explodeOn: number[];
  readonly chainExplosion: boolean;
  readonly additionalDice: number;
  readonly maxDepth: number;
}