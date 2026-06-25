import { describe, expect, it } from "vitest";
import { Classes } from "../types/characters.ts";
import { DungeonDifficulty } from "../types/dungeons.ts";
import { buildExportStatusString } from "./build-export-status.ts";
import {
  createTestCharacter,
  createTestDungeon,
  createTestToggles,
} from "../test/fixtures.ts";

describe("buildExportStatusString", () => {
  it("returns message when no dungeons are visible", () => {
    expect(
      buildExportStatusString({
        characters: [createTestCharacter()],
        dungeons: [],
        dungeonToggles: {},
      }),
    ).toBe("No dungeons match the current filter.");
  });

  it("returns message when no characters are selected", () => {
    expect(
      buildExportStatusString({
        characters: [],
        dungeons: [createTestDungeon()],
        dungeonToggles: {},
      }),
    ).toBe("Select at least one character.");
  });

  it("lists characters without CD per dungeon", () => {
    const alpha = createTestCharacter({ id: "character-1", name: "Alpha" });
    const beta = createTestCharacter({
      id: "character-2",
      name: "Beta",
      class: Classes[5],
      mainSpec: { spec: "Shadow", gearScore: 5800 },
    });
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
      buildExportStatusString({
        characters: [alpha, beta],
        dungeons: [dungeon],
        dungeonToggles: toggles,
      }),
    ).toBe("ICC25H - Beta SP 5.8k");
  });

  it("returns all-have-CD message when every selected character has CD", () => {
    const alpha = createTestCharacter({ id: "character-1", name: "Alpha" });
    const dungeon = createTestDungeon({ id: "dungeon-1", shortName: "ICC" });
    const toggles = createTestToggles([
      { characterId: "character-1", dungeonId: "dungeon-1", on: true },
    ]);

    expect(
      buildExportStatusString({
        characters: [alpha],
        dungeons: [dungeon],
        dungeonToggles: toggles,
      }),
    ).toBe("All selected characters have CD on matching dungeons.");
  });

  it("uses chosen export spec selection per character", () => {
    const character = createTestCharacter({
      id: "character-1",
      name: "Elst",
      class: Classes[0],
      mainSpec: { spec: "Unholy", gearScore: 6615 },
      offSpec: { spec: "Blood", gearScore: 6023 },
    });
    const dungeon = createTestDungeon({ id: "dungeon-1", shortName: "ICC" });
    const toggles = createTestToggles([
      { characterId: "character-1", dungeonId: "dungeon-1", on: false },
    ]);

    expect(
      buildExportStatusString({
        characters: [character],
        dungeons: [dungeon],
        dungeonToggles: toggles,
        exportSpecSelectionByCharacterId: {
          "character-1": {
            includeMain: false,
            includeOff: true,
            includeWithoutSpec: true,
          },
        },
      }),
    ).toBe("ICC25 - Elst Blood 6k");
  });

  it("omits characters with no specs selected", () => {
    const character = createTestCharacter({
      id: "character-1",
      name: "Elst",
      class: Classes[0],
      mainSpec: { spec: "Unholy", gearScore: 6615 },
      offSpec: { spec: "Blood", gearScore: 6023 },
    });
    const dungeon = createTestDungeon({ id: "dungeon-1", shortName: "ICC" });
    const toggles = createTestToggles([
      { characterId: "character-1", dungeonId: "dungeon-1", on: false },
    ]);

    expect(
      buildExportStatusString({
        characters: [character],
        dungeons: [dungeon],
        dungeonToggles: toggles,
        exportSpecSelectionByCharacterId: {
          "character-1": {
            includeMain: false,
            includeOff: false,
            includeWithoutSpec: false,
          },
        },
      }),
    ).toBe("All selected characters have CD on matching dungeons.");
  });
});
