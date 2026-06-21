import { describe, expect, it } from "vitest";
import {
  DEFAULT_DUNGEON_DIFFICULTY,
  DEFAULT_DUNGEON_FORM_SIZE,
  MAX_DUNGEON_SHORT_NAME_LENGTH,
  defaultDungeonFormValues,
} from "../constants/dungeon-form-defaults.ts";
import { RaidNames } from "../data/raid-names.ts";
import { DungeonDifficulty } from "../types/dungeons.ts";
import { parseDungeonForm } from "./validate-dungeon.ts";

describe("parseDungeonForm", () => {
  it("rejects empty dungeon name", () => {
    expect(parseDungeonForm(defaultDungeonFormValues())).toEqual({
      ok: false,
      error: "Enter a dungeon name.",
    });
  });

  it("rejects short name over max length", () => {
    const values = {
      ...defaultDungeonFormValues(),
      name: "Custom Raid",
      shortName: "a".repeat(MAX_DUNGEON_SHORT_NAME_LENGTH + 1),
    };
    expect(parseDungeonForm(values)).toEqual({
      ok: false,
      error: `Short name must be at most ${MAX_DUNGEON_SHORT_NAME_LENGTH} characters.`,
    });
  });

  it("rejects invalid item level input", () => {
    const values = {
      ...defaultDungeonFormValues(),
      name: "Custom Raid",
      itemLevelText: "not-a-number",
    };
    expect(parseDungeonForm(values)).toEqual({
      ok: false,
      error: "Enter at least one item level (e.g. 200 or range like 200 / 213).",
    });
  });

  it("applies default short name for known raid names", () => {
    const values = {
      ...defaultDungeonFormValues(),
      name: RaidNames.icecrownCitadel.en,
      itemLevelText: "264",
      size: 25 as const,
      difficulty: DungeonDifficulty.HEROIC,
    };
    const result = parseDungeonForm(values);
    expect(result).toEqual({
      ok: true,
      fields: {
        name: RaidNames.icecrownCitadel.en,
        shortName: RaidNames.icecrownCitadel.shortEn,
        size: 25,
        itemLevel: [264],
        difficulty: DungeonDifficulty.HEROIC,
      },
    });
  });

  it("accepts valid custom dungeon without short name", () => {
    const result = parseDungeonForm({
      name: "  My Raid  ",
      shortName: "",
      size: DEFAULT_DUNGEON_FORM_SIZE,
      itemLevelText: "200 / 213",
      difficulty: DEFAULT_DUNGEON_DIFFICULTY,
    });
    expect(result).toEqual({
      ok: true,
      fields: {
        name: "My Raid",
        size: DEFAULT_DUNGEON_FORM_SIZE,
        itemLevel: [200, 213],
        difficulty: DEFAULT_DUNGEON_DIFFICULTY,
      },
    });
  });
});
