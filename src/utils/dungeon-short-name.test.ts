import { describe, expect, it } from "vitest";
import { RaidNames } from "../data/raid-names.ts";
import {
  defaultShortNameForDungeonName,
  getLocalizedRaidNameSuggestions,
} from "./dungeon-short-name.ts";

describe("getLocalizedRaidNameSuggestions", () => {
  it("returns English raid names sorted for en locale", () => {
    const suggestions = getLocalizedRaidNameSuggestions("en");
    expect(suggestions).toContain(RaidNames.icecrownCitadel.en);
    expect(suggestions).toContain(RaidNames.naxxramas.en);
    expect(suggestions.length).toBe(Object.keys(RaidNames).length);
    expect([...suggestions]).toEqual(
      [...suggestions].sort((left, right) => left.localeCompare(right, "en")),
    );
  });

  it("returns Russian raid names sorted for ru locale", () => {
    const suggestions = getLocalizedRaidNameSuggestions("ru");
    expect(suggestions).toContain(RaidNames.icecrownCitadel.ru);
    expect(suggestions).toContain(RaidNames.naxxramas.ru);
    expect(suggestions.length).toBe(Object.keys(RaidNames).length);
    expect([...suggestions]).toEqual(
      [...suggestions].sort((left, right) => left.localeCompare(right, "ru")),
    );
  });
});

describe("defaultShortNameForDungeonName", () => {
  it("resolves short name for known English raid name", () => {
    expect(defaultShortNameForDungeonName(RaidNames.icecrownCitadel.en)).toBe(
      RaidNames.icecrownCitadel.shortEn,
    );
  });
});
