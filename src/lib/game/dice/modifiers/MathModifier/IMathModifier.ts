import type { IModifier, ModifierType } from "../IModifier";

export interface IMathModifier extends IModifier {
  readonly type: ModifierType.Math;
  strategy: OperationStrategy;
  value: number;
}

export interface OperationStrategy {
  apply(value: number, modifier: number): number;
  getDescription(modifier: number): string;
}

export class AdditionStrategy implements OperationStrategy {
  apply(value: number, modifier: number): number {
    return value + modifier;
  }
  getDescription(modifier: number): string {
    return `add ${modifier} to each die result.`;
  }
}

export class SubtractionStrategy implements OperationStrategy {
  apply(value: number, modifier: number): number {
    return value - modifier;
  }
  getDescription(modifier: number): string {
    return `subtract ${modifier} from each die result.`;
  }
}


export class MultiplicationStrategy implements OperationStrategy{
  apply(value: number, modifier: number): number {
    return value * modifier;
  }
  getDescription(modifier: number): string {
    return `multiply each die result by ${modifier}.`;
  }
}

export class DivisionStrategy implements OperationStrategy {
  apply(value: number, modifier: number): number {
    return Math.floor(value / modifier);
  }
  getDescription(modifier: number): string {
    return `divide each die result by ${modifier} and round down.`;
  }
}