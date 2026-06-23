import { ClassName, type ClassName as ClassNameType } from "../types/characters.ts";

/** WotLK talent specializations per class (display order). */
export const ClassSpecs: Record<ClassNameType, readonly string[]> = {
  [ClassName.DeathKnight]: ["Blood", "Frost", "Unholy"],
  [ClassName.Druid]: ["Balance", "Feral", "Restoration"],
  [ClassName.Hunter]: ["Beast Mastery", "Marksmanship", "Survival"],
  [ClassName.Mage]: ["Arcane", "Fire", "Frost"],
  [ClassName.Paladin]: ["Holy", "Protection", "Retribution"],
  [ClassName.Priest]: ["Discipline", "Holy", "Shadow"],
  [ClassName.Rogue]: ["Assassination", "Combat", "Subtlety"],
  [ClassName.Shaman]: ["Elemental", "Enhancement", "Restoration"],
  [ClassName.Warlock]: ["Affliction", "Demonology", "Destruction"],
  [ClassName.Warrior]: ["Arms", "Fury", "Protection"],
};

export function specsForClass(className: ClassNameType): readonly string[] {
  return ClassSpecs[className];
}

export function isSpecValidForClass(
  className: ClassNameType,
  spec: string,
): boolean {
  return ClassSpecs[className].includes(spec);
}

/** Short spec labels for compact import / roster strings. */
export const SpecShortNames: Record<string, string> = {
  Affliction: "Affli",
  Arcane: "Arcane",
  Arms: "Arms",
  Assassination: "Assasin",
  Balance: "Balance",
  "Beast Mastery": "BM",
  Blood: "Blood",
  Combat: "Combat",
  Demonology: "Demo",
  Destruction: "Dest",
  Discipline: "Disc",
  Elemental: "Ele",
  Enhancement: "Enh",
  Feral: "Feral",
  Fire: "Fire",
  Frost: "Frost",
  Fury: "Fury",
  Holy: "Holy",
  Marksmanship: "MM",
  Protection: "Prot",
  Restoration: "Resto",
  Retribution: "Ret",
  Shadow: "SP",
  Subtlety: "Sub",
  Survival: "Surv",
  Unholy: "Udk",
};

export function shortSpecName(spec: string): string {
  return SpecShortNames[spec] ?? spec;
}
