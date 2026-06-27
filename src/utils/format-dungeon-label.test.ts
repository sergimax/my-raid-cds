import { describe, expect, it } from "vitest";
import { RaidNames } from "../data/raid-names.ts";
import { DungeonDifficulty } from "../types/dungeons.ts";
import { formatDungeonExportLabel } from "./format-dungeon-label.ts";
import { createTestDungeon } from "../test/fixtures.ts";

describe("formatDungeonExportLabel", () => {
  it("formats normal Latin label", () => {
    const dungeon = createTestDungeon({
      shortName: "ICC",
      size: 25,
      difficulty: DungeonDifficulty.NORMAL,
    });
    expect(formatDungeonExportLabel(dungeon)).toBe("ICC25");
  });

  it("formats heroic Latin label with H suffix", () => {
    const dungeon = createTestDungeon({
      shortName: "ICC",
      size: 25,
      difficulty: DungeonDifficulty.HEROIC,
    });
    expect(formatDungeonExportLabel(dungeon)).toBe("ICC25H");
  });

  it("formats heroic Cyrillic label with хм suffix", () => {
    const dungeon = createTestDungeon({
      name: RaidNames.icecrownCitadel.ru,
      shortName: RaidNames.icecrownCitadel.shortRu,
      size: 25,
      difficulty: DungeonDifficulty.HEROIC,
    });
    expect(formatDungeonExportLabel(dungeon, "ru")).toBe("ЦЛК25хм");
  });
});
