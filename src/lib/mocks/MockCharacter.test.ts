import { describe, it, expect } from "vitest";
import { MockCharacter } from "./MockCharacter";
import { StartingArea } from "$lib/locations/Location";
import { MockProficiency } from "./MockProficiency";

describe("MockCharacter", () => {

  it("should initialize with default attributes when no attributes are provided", () => {
    const character = new MockCharacter();

    const defaults = {
      name: "Mock Character",
      health: 10,
      maxHealth: 20,
      energy: 10,
      encumbrance: 5,
      rations: 3,
      wealth: 10,
      inventory: new Map(),
      skills: new Map(),
      proficiency: MockProficiency,
      currentLocation: StartingArea,
    };

    expect(character.name).toBe(defaults.name);
    expect(character.health).toBe(defaults.health);
    expect(character.maxHealth).toBe(defaults.maxHealth);
    expect(character.energy).toBe(defaults.energy);
    expect(character.encumbrance).toBe(defaults.encumbrance);
    expect(character.rations).toBe(defaults.rations);
    expect(character.wealth).toBe(defaults.wealth);
    expect(character.inventory).toStrictEqual(defaults.inventory);
    expect(character.currentLocation).toBe(defaults.currentLocation);
    expect(character.skills).toStrictEqual(defaults.skills);
    expect(character.proficiency).toStrictEqual(defaults.proficiency);
  });

  it("should allow overriding specific attributes", () => {
    const character = new MockCharacter({ health: 15 });
    expect(character.health).toBe(15);
  });

  it("should allow overriding default proficiency", () => {
    const customProficiency = { name: "Custom Proficiency", displayName: "Custom" };
    const character = new MockCharacter({ proficiency: customProficiency });
    expect(character.proficiency).toBe(customProficiency);
  });

});
