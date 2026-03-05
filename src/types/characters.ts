export type CharacterClass = {
  name: string;
  color?: string;
  icon?: string;
};

export const Classes: Array<CharacterClass> = [
  {
    name: "Death Knight",
  },
  {
    name: "Druid",
  },
  {
    name: "Hunter",
  },
  {
    name: "Mage",
  },
  {
    name: "Paladin",
  },
  {
    name: "Priest",
  },
  {
    name: "Rogue",
  },
  {
    name: "Shaman",
  },
  {
    name: "Warlock",
  },
  {
    name: "Warrior",
  },
];

export type Character = {
  name: string;
  class?: CharacterClass;
  level?: number;
  gearScore?: number;
};
