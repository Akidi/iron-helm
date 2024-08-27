import type { IModifier, ModifierType } from "../IModifier";

export interface IKeepModifier extends IModifier {
  readonly type: ModifierType.Keep;
  readonly keepCount: number;
  readonly keepHighest: boolean;
}