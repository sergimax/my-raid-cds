import { describe, expect, it } from "vitest";
import { DungeonDifficulty } from "../types/dungeons.ts";
import { buildImportStatusString } from "./build-import-status.ts";
import {
  createTestCharacter,
  createTestDungeon,
  createTestToggles,
} from "../test/fixtures.ts";

describe("buildImportStatusString", () => {
  it("returns message when no dungeons are visible", () => {
    expect(
      buildImportStatusString({
        characters: [createTestCharacter()],
        dungeons: [],
        dungeonToggles: {},
      }),
    ).toBe("No dungeons match the current filter.");
  });

  it("returns message when no characters are selected", () => {
    expect(
      buildImportStatusString({
        characters: [],
        dungeons: [createTestDungeon()],
        dungeonToggles: {},
      }),
    ).toBe("Select at least one character.");
  });

  it("lists characters without CD per dungeon", () => {
    const alpha = createTestCharacter({ id: "character-1", name: "Alpha" });
    const beta = createTestCharacter({ id: "character-2", name: "Beta" });
    const dungeon = createTestDungeon({
      id: "dungeon-1",
      shortName: "ICC",
      size: 25,
      difficulty: DungeonDifficulty.HEROIC,
    });
    const toggles = createTestToggles([
      { characterId: "character-1", dungeonId: "dungeon-1", on: true },
      { characterId: "character-2", dungeonId: "dungeon-1", on: false },
    ]);

    expect(
      buildImportStatusString({
        characters: [alpha, beta],
        dungeons: [dungeon],
        dungeonToggles: toggles,
      }),
    ).toBe("ICC25H - Beta");
  });

  it("returns all-have-CD message when every selected character has CD", () => {
    const alpha = createTestCharacter({ id: "character-1", name: "Alpha" });
    const dungeon = createTestDungeon({ id: "dungeon-1", shortName: "ICC" });
    const toggles = createTestToggles([
      { characterId: "character-1", dungeonId: "dungeon-1", on: true },
    ]);

    expect(
      buildImportStatusString({
        characters: [alpha],
        dungeons: [dungeon],
        dungeonToggles: toggles,
      }),
    ).toBe("All selected characters have CD on matching dungeons.");
  });
});
