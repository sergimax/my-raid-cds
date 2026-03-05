import { classIcons } from "../assets/class-icons/class-icons";

export type CharacterClass = {
  name: string;
  color?: string;
  icon: string;
};

export const Classes: Array<CharacterClass> = [
  { name: "Death Knight", icon: classIcons["Death Knight"], color: 'C41E3A'},
  { name: "Druid", icon: classIcons.Druid, color: 'FF7C0A' },
  { name: "Hunter", icon: classIcons.Hunter, color: 'AAD372' },
  { name: "Mage", icon: classIcons.Mage, color: '3FC7EB' },
  { name: "Paladin", icon: classIcons.Paladin, color: 'F48CBA' },
  { name: "Priest", icon: classIcons.Priest, color: 'FFFFFF' },
  { name: "Rogue", icon: classIcons.Rogue, color: 'FFF468' },
  { name: "Shaman", icon: classIcons.Shaman, color: '0070DD' },
  { name: "Warlock", icon: classIcons.Warlock, color: '8788EE' },
  { name: "Warrior", icon: classIcons.Warrior, color: 'C69B6D' }
];

export type Character = {
  name: string;
  class?: CharacterClass;
  level?: number;
  gearScore?: number;
};
