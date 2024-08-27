import type { IModifier } from "./modifiers/IModifier";

export class HistoryManager {
  private history: Array<{ 
    input: number[], 
    output: number[], 
    modifier: string, 
    description: string, 
    additionalRolls: number[] 
  }> = [];

  addEntry(input: number[], output: number[], modifier: IModifier, additionalRolls: number[] = []): void {
    this.history.push({
      input: input.slice(),
      output: output.slice(),
      modifier: modifier.constructor.name,
      description: modifier.getDescription(),
      additionalRolls: additionalRolls.slice()
    });
  }

  getHistory(): Array<{ 
    input: number[], 
    output: number[], 
    modifier: string, 
    description: string, 
    additionalRolls: number[] 
  }> {
    return this.history.slice(); // Return a copy of the history
  }

  clearHistory(): void {
    this.history = [];
  }
}
