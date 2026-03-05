import { classIcons } from "../assets/class-icons/class-icons";

export const ClassName = {
  DeathKnight: "Death Knight",
  Druid: "Druid",
  Hunter: "Hunter",
  Mage: "Mage",
  Paladin: "Paladin",
  Priest: "Priest",
  Rogue: "Rogue",
  Shaman: "Shaman",
  Warlock: "Warlock",
  Warrior: "Warrior",
} as const;

export type ClassName = (typeof ClassName)[keyof typeof ClassName];

export type CharacterClass = {
  name: ClassName;
  color: string;
  icon: string;
};

export const Classes: Array<CharacterClass> = [
  { name: ClassName.DeathKnight, icon: classIcons["Death Knight"], color: "C41E3A" },
  { name: ClassName.Druid, icon: classIcons.Druid, color: "FF7C0A" },
  { name: ClassName.Hunter, icon: classIcons.Hunter, color: "AAD372" },
  { name: ClassName.Mage, icon: classIcons.Mage, color: "3FC7EB" },
  { name: ClassName.Paladin, icon: classIcons.Paladin, color: "F48CBA" },
  { name: ClassName.Priest, icon: classIcons.Priest, color: "FFFFFF" },
  { name: ClassName.Rogue, icon: classIcons.Rogue, color: "FFF468" },
  { name: ClassName.Shaman, icon: classIcons.Shaman, color: "0070DD" },
  { name: ClassName.Warlock, icon: classIcons.Warlock, color: "8788EE" },
  { name: ClassName.Warrior, icon: classIcons.Warrior, color: "C69B6D" },
];

export type Character = {
  name: string;
  class?: CharacterClass;
  level?: number;
  gearScore?: number;
};

export type CharacterRecord = Character & { id: string };
