import { ModifierBase } from "../ModifierBase";
import { ModifierType } from "../IModifier";
import { CryptoRNG, type IRNG } from "$lib/game/RNG";
import { AdditionStrategy, DivisionStrategy, MultiplicationStrategy, SubtractionStrategy, type IMathModifier, type OperationStrategy } from "./IMathModifier";

export class MathModifier extends ModifierBase implements IMathModifier {
  readonly type = ModifierType.Math;
  private _value: number = 0;
  public strategy: OperationStrategy;

  constructor(rng: IRNG = new CryptoRNG()) {
    super(rng);
    this.strategy = new AdditionStrategy();
  }

  public get value(): number {
    return this._value;
  }

  public matchesAndConsume(modifierString: string): { modifier: IMathModifier | null; remainingString: string } {
    const mathRegex = /(\+|\-|\*|\/)(\d+)/;
    const match = modifierString.match(mathRegex);

    if (match) {
      switch (match[1]) {
        case "+":
          this.strategy = new AdditionStrategy();
          break;
        case "-":
          this.strategy = new SubtractionStrategy();
          break;
        case "*":
          this.strategy = new MultiplicationStrategy();
          break;
        case "/":
          this.strategy = new DivisionStrategy();
          break;
        default:
          throw new Error(`Invalid operation: ${match[1]}`);
      }
      this._value = parseInt(match[2], 10);
      const remainingString = modifierString.replace(match[0], '').trim();
      return { modifier: this, remainingString };
    }

    return { modifier: null, remainingString: modifierString };
  }

  public apply(diceResults: number[]): number[] {
    return diceResults.map(result => this.strategy.apply(result, this._value));
  }

  public getDescription(): string {
    return this.strategy.getDescription(this._value);
  }
}
