import type { Character } from "$lib/game/entities/Character";
import type { Effect, Skills } from "$lib/skills/Skill";

export const MockEffect: Effect = {
  description: "Mock effect for testing purposes",
  type: "passive",
  apply: (character: Character) => {
    character.energy += 5; // Example effect: increase energy
  }
};

export const MockSkill: Skills = {
  name: "MockSkill",
  effects: [MockEffect]
};