import { describe, expect, it } from "vitest";
import { Classes } from "../types/characters.ts";
import { DungeonDifficulty } from "../types/dungeons.ts";
import { buildExportStatus, buildExportStatusString, formatExportLineCopyText } from "./build-export-status.ts";
import { testTranslator } from "../test/i18n.ts";
import {
  createTestCharacter,
  createTestDungeon,
  createTestToggles,
} from "../test/fixtures.ts";

describe("buildExportStatusString", () => {
  const baseParams = { t: testTranslator, locale: "en" as const };

  it("returns message when no dungeons are visible", () => {
    expect(
      buildExportStatusString({
        ...baseParams,
        characters: [createTestCharacter()],
        dungeons: [],
        dungeonToggles: {},
      }),
    ).toBe("No dungeons match the current filter.");
  });

  it("returns message when no characters are selected", () => {
    expect(
      buildExportStatusString({
        ...baseParams,
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
        ...baseParams,
        characters: [alpha, beta],
        dungeons: [dungeon],
        dungeonToggles: toggles,
      }),
    ).toBe("ICC25H - Beta: SP 5.8");
  });

  it("joins multiple characters with slash separator", () => {
    const alpha = createTestCharacter({
      id: "character-1",
      name: "Alpha",
      class: Classes[5],
      mainSpec: { spec: "Shadow", gearScore: 5800 },
    });
    const beta = createTestCharacter({
      id: "character-2",
      name: "Beta",
      class: Classes[0],
      mainSpec: { spec: "Unholy", gearScore: 6615 },
    });
    const dungeon = createTestDungeon({
      id: "dungeon-1",
      shortName: "ICC",
      size: 25,
      difficulty: DungeonDifficulty.NORMAL,
    });
    const toggles = createTestToggles([
      { characterId: "character-1", dungeonId: "dungeon-1", on: false },
      { characterId: "character-2", dungeonId: "dungeon-1", on: false },
    ]);

    expect(
      buildExportStatusString({
        ...baseParams,
        characters: [alpha, beta],
        dungeons: [dungeon],
        dungeonToggles: toggles,
      }),
    ).toBe("ICC25 - Alpha: SP 5.8 / Beta: Udk 6.6");
  });

  it("returns all-have-CD message when every selected character has CD", () => {
    const alpha = createTestCharacter({ id: "character-1", name: "Alpha" });
    const dungeon = createTestDungeon({ id: "dungeon-1", shortName: "ICC" });
    const toggles = createTestToggles([
      { characterId: "character-1", dungeonId: "dungeon-1", on: true },
    ]);

    expect(
      buildExportStatusString({
        ...baseParams,
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
        ...baseParams,
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
    ).toBe("ICC25 - Elst: Blood 6");
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
        ...baseParams,
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

  it("defaults role filter when omitted or undefined", () => {
    const character = createTestCharacter({
      id: "character-1",
      name: "Beta",
      class: Classes[5],
      mainSpec: { spec: "Shadow", gearScore: 5800 },
    });
    const dungeon = createTestDungeon({ id: "dungeon-1", shortName: "ICC" });
    const toggles = createTestToggles([
      { characterId: "character-1", dungeonId: "dungeon-1", on: false },
    ]);
    const expected = "ICC25 - Beta: SP 5.8";

    expect(
      buildExportStatusString({
        ...baseParams,
        characters: [character],
        dungeons: [dungeon],
        dungeonToggles: toggles,
      }),
    ).toBe(expected);
    expect(
      buildExportStatusString({
        ...baseParams,
        characters: [character],
        dungeons: [dungeon],
        dungeonToggles: toggles,
        roleFilter: undefined,
      }),
    ).toBe(expected);
  });

  it("filters export lines by minimum gear score", () => {
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
        ...baseParams,
        characters: [character],
        dungeons: [dungeon],
        dungeonToggles: toggles,
        minGearScore: 6500,
      }),
    ).toBe("ICC25 - Elst: Udk 6.6");
  });

  it("returns structured lines from buildExportStatus", () => {
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
      { characterId: "character-2", dungeonId: "dungeon-1", on: false },
    ]);

    const result = buildExportStatus({
      ...baseParams,
      characters: [beta],
      dungeons: [dungeon],
      dungeonToggles: toggles,
    });

    expect(result.kind).toBe("lines");
    if (result.kind !== "lines") {
      return;
    }
    expect(result.lines).toEqual([
      {
        dungeonId: "dungeon-1",
        raidLabel: "ICC25H",
        charactersLabel: "Beta: SP 5.8",
      },
    ]);
    expect(formatExportLineCopyText(result.lines[0])).toBe("ICC25H - Beta: SP 5.8");
  });
});
