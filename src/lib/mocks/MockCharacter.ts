import { Character, type CharacterAttributes } from "$lib/game/entities/Character";
import { StartingArea } from "$lib/locations/Location";
import { MockProficiency } from "./MockProficiency";


export class MockCharacter extends Character {
  constructor(attributes: Partial<CharacterAttributes> = {}) {
    const defaultAttributes = {
      name: "Mock Character",
      health: 10,
      maxHealth: 20,
      energy: 10,
      encumbrance: 5,
      rations: 3,
      wealth: 10,
      inventory: new Map(), // Empty inventory by default
      skills: new Map(), // Empty skills by default
      proficiency: MockProficiency, // Default proficiency
      currentLocation: StartingArea, // Default starting location
    }
    super({...defaultAttributes, ...attributes});
  }
}