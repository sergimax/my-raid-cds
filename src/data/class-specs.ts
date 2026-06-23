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

/** WotLK talent specs: English (internal) + Russian (in-game) names and short labels. */
export type SpecNameEntry = {
  en: string;
  ru: string;
  shortEn: string;
  shortRu: string;
};

/** Spec metadata keyed by class — duplicate spec names (Holy, Frost, etc.) differ per class. */
export const ClassSpecNames: Record<ClassNameType, Record<string, SpecNameEntry>> = {
  [ClassName.DeathKnight]: {
    Blood: {
      en: "Blood",
      ru: "Кровь",
      shortEn: "Blood",
      shortRu: "БДК",
    },
    Frost: {
      en: "Frost",
      ru: "Лед",
      shortEn: "FrostDK",
      shortRu: "ФДК",
    },
    Unholy: {
      en: "Unholy",
      ru: "Нечестивость",
      shortEn: "Udk",
      shortRu: "Адк",
    },
  },
  [ClassName.Druid]: {
    Balance: {
      en: "Balance",
      ru: "Баланс",
      shortEn: "Balance",
      shortRu: "Баланс",
    },
    Feral: {
      en: "Feral",
      ru: "Звериный",
      shortEn: "Feral",
      shortRu: "Ферал",
    },
    Restoration: {
      en: "Restoration",
      ru: "Исцеление",
      shortEn: "Rdru",
      shortRu: "Рдру",
    },
  },
  [ClassName.Hunter]: {
    "Beast Mastery": {
      en: "Beast Mastery",
      ru: "Повелитель зверей",
      shortEn: "BM",
      shortRu: "БМ",
    },
    Marksmanship: {
      en: "Marksmanship",
      ru: "Стрельба",
      shortEn: "MM",
      shortRu: "ММ",
    },
    Survival: {
      en: "Survival",
      ru: "Выживание",
      shortEn: "Surv",
      shortRu: "Сурв",
    },
  },
  [ClassName.Mage]: {
    Arcane: {
      en: "Arcane",
      ru: "Тайная магия",
      shortEn: "Arcane",
      shortRu: "Аркан",
    },
    Fire: {
      en: "Fire",
      ru: "Огонь",
      shortEn: "Fire",
      shortRu: "Фаер",
    },
    Frost: {
      en: "Frost",
      ru: "Лед",
      shortEn: "Frost",
      shortRu: "Фростм",
    },
  },
  [ClassName.Paladin]: {
    Holy: {
      en: "Holy",
      ru: "Свет",
      shortEn: "Hpal",
      shortRu: "Хпал",
    },
    Protection: {
      en: "Protection",
      ru: "Защита",
      shortEn: "Protpal",
      shortRu: "Ппал",
    },
    Retribution: {
      en: "Retribution",
      ru: "Воздаяние",
      shortEn: "Ret",
      shortRu: "Ретри",
    },
  },
  [ClassName.Priest]: {
    Discipline: {
      en: "Discipline",
      ru: "Послушание",
      shortEn: "Disc",
      shortRu: "ДЦ",
    },
    Holy: {
      en: "Holy",
      ru: "Свет",
      shortEn: "Holy",
      shortRu: "Хприст",
    },
    Shadow: {
      en: "Shadow",
      ru: "Тьма",
      shortEn: "SP",
      shortRu: "ШП",
    },
  },
  [ClassName.Rogue]: {
    Assassination: {
      en: "Assassination",
      ru: "Ликвидация",
      shortEn: "Assasin",
      shortRu: "Арог",
    },
    Combat: {
      en: "Combat",
      ru: "Бой",
      shortEn: "Combat",
      shortRu: "Крог",
    },
    Subtlety: {
      en: "Subtlety",
      ru: "Скрытность",
      shortEn: "Sub",
      shortRu: "Саб",
    },
  },
  [ClassName.Shaman]: {
    Elemental: {
      en: "Elemental",
      ru: "Стихии",
      shortEn: "Elem",
      shortRu: "Элем",
    },
    Enhancement: {
      en: "Enhancement",
      ru: "Совершенствование",
      shortEn: "Enh",
      shortRu: "Энх",
    },
    Restoration: {
      en: "Restoration",
      ru: "Исцеление",
      shortEn: "Rsham",
      shortRu: "Ршам",
    },
  },
  [ClassName.Warlock]: {
    Affliction: {
      en: "Affliction",
      ru: "Колдовство",
      shortEn: "Affli",
      shortRu: "Афли",
    },
    Demonology: {
      en: "Demonology",
      ru: "Демонология",
      shortEn: "Demon",
      shortRu: "Демон",
    },
    Destruction: {
      en: "Destruction",
      ru: "Разрушение",
      shortEn: "Dest",
      shortRu: "Дестро",
    },
  },
  [ClassName.Warrior]: {
    Arms: {
      en: "Arms",
      ru: "Оружие",
      shortEn: "Arms",
      shortRu: "Армс",
    },
    Fury: {
      en: "Fury",
      ru: "Неистовство",
      shortEn: "Fury",
      shortRu: "Фури",
    },
    Protection: {
      en: "Protection",
      ru: "Защита",
      shortEn: "Protwar",
      shortRu: "Пвар",
    },
  },
};

export function specNameEntry(
  className: ClassNameType,
  spec: string,
): SpecNameEntry | undefined {
  return ClassSpecNames[className]?.[spec];
}

export function shortSpecName(className: ClassNameType, spec: string): string {
  return specNameEntry(className, spec)?.shortEn ?? spec;
}

export function specRuName(className: ClassNameType, spec: string): string {
  return specNameEntry(className, spec)?.ru ?? spec;
}

export function shortSpecRuName(className: ClassNameType, spec: string): string {
  return specNameEntry(className, spec)?.shortRu ?? spec;
}
