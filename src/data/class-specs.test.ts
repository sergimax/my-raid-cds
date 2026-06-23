import { describe, expect, it } from "vitest";
import { ClassName } from "../types/characters.ts";
import {
  ClassSpecNames,
  shortSpecName,
  shortSpecRuName,
  specNameEntry,
  specRuName,
} from "./class-specs.ts";

const specCases = Object.entries(ClassSpecNames).flatMap(([className, specs]) =>
  Object.entries(specs).map(([spec, entry]) => ({
    className: className as ClassName,
    spec,
    entry,
  })),
);

describe("ClassSpecNames helpers", () => {
  it.each(specCases)(
    "resolves $className $spec metadata",
    ({ className, spec, entry }) => {
      expect(specNameEntry(className, spec)).toEqual(entry);
      expect(specRuName(className, spec)).toBe(entry.ru);
      expect(shortSpecName(className, spec)).toBe(entry.shortEn);
      expect(shortSpecRuName(className, spec)).toBe(entry.shortRu);
    },
  );

  it("differentiates duplicate spec names per class", () => {
    expect(shortSpecRuName(ClassName.Druid, "Restoration")).toBe("Рдру");
    expect(shortSpecRuName(ClassName.Shaman, "Restoration")).toBe("Ршам");
    expect(shortSpecName(ClassName.Paladin, "Holy")).toBe("Hpal");
    expect(shortSpecName(ClassName.Priest, "Holy")).toBe("Holy");
    expect(shortSpecRuName(ClassName.Paladin, "Holy")).toBe("Хпал");
    expect(shortSpecRuName(ClassName.Priest, "Holy")).toBe("Хприст");
    expect(shortSpecName(ClassName.Mage, "Frost")).toBe("Frost");
    expect(shortSpecRuName(ClassName.Mage, "Frost")).toBe("Фростм");
    expect(shortSpecName(ClassName.DeathKnight, "Frost")).toBe("FrostDK");
    expect(shortSpecRuName(ClassName.DeathKnight, "Frost")).toBe("ФДК");
    expect(shortSpecName(ClassName.Paladin, "Protection")).toBe("Protpal");
    expect(shortSpecRuName(ClassName.Paladin, "Protection")).toBe("Ппал");
    expect(shortSpecName(ClassName.Warrior, "Protection")).toBe("Protwar");
    expect(shortSpecRuName(ClassName.Warrior, "Protection")).toBe("Пвар");
  });

  it("returns updated Russian short labels for common specs", () => {
    expect(shortSpecRuName(ClassName.DeathKnight, "Blood")).toBe("БДК");
    expect(shortSpecRuName(ClassName.DeathKnight, "Unholy")).toBe("Адк");
    expect(shortSpecRuName(ClassName.Hunter, "Beast Mastery")).toBe("БМ");
    expect(shortSpecRuName(ClassName.Hunter, "Marksmanship")).toBe("ММ");
    expect(shortSpecRuName(ClassName.Priest, "Discipline")).toBe("ДЦ");
    expect(shortSpecRuName(ClassName.Priest, "Shadow")).toBe("ШП");
    expect(shortSpecRuName(ClassName.Shaman, "Elemental")).toBe("Элем");
    expect(shortSpecRuName(ClassName.Shaman, "Enhancement")).toBe("Энх");
    expect(shortSpecRuName(ClassName.Warlock, "Affliction")).toBe("Афли");
    expect(shortSpecRuName(ClassName.Warlock, "Demonology")).toBe("Демон");
    expect(shortSpecRuName(ClassName.Warlock, "Destruction")).toBe("Дестро");
  });

  it("returns updated English short labels where they differ from spec name", () => {
    expect(shortSpecName(ClassName.Shaman, "Elemental")).toBe("Elem");
    expect(shortSpecName(ClassName.Warlock, "Demonology")).toBe("Demon");
    expect(shortSpecName(ClassName.Rogue, "Assassination")).toBe("Assasin");
  });
});
