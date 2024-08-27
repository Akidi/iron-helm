import type { Character } from "$lib/game/entities/Character";
import type { Item } from "$lib/items/Inventory";

export class MockItem implements Item {
  name = "MockItem";
  use(character: Character) {
    character.energy += 1; // Example effect
  }
}
