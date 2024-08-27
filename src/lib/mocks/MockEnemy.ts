import { Monster, WeaknessType, type MonsterAttributes } from "$lib/game/entities/Enemy";

export class MockMonster extends Monster {
  constructor(attributes: Partial<MonsterAttributes> = {}) {
    const defaultAttributes: MonsterAttributes = {
      name: "",
      health: 0,
      damage: 0,
      treausreType: { 
        use: character => {}
      },
      weakness: WeaknessType.FIRE,
      special: {
        description: "None",
        effect: [],
      },
      gold: 0
    };

    super({ ...defaultAttributes, ...attributes });
  }
}