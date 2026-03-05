import { classIcons } from "../assets/class-icons/class-icons";

export type CharacterClass = {
  name: string;
  color?: string;
  icon: string;
};

export const Classes: Array<CharacterClass> = [
  { name: "Death Knight", icon: classIcons["Death Knight"] },
  { name: "Druid", icon: classIcons.Druid },
  { name: "Hunter", icon: classIcons.Hunter },
  { name: "Mage", icon: classIcons.Mage },
  { name: "Paladin", icon: classIcons.Paladin },
  { name: "Priest", icon: classIcons.Priest },
  { name: "Rogue", icon: classIcons.Rogue },
  { name: "Shaman", icon: classIcons.Shaman },
  { name: "Warlock", icon: classIcons.Warlock },
  { name: "Warrior", icon: classIcons.Warrior },
];

export type Character = {
  name: string;
  class?: CharacterClass;
  level?: number;
  gearScore?: number;
};
