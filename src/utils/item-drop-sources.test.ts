import { describe, expect, it } from "vitest";
import { DungeonDifficulty } from "../types/dungeons.ts";
import {
  formatItemDropSourceLine,
  getFormattedItemDropSources,
  groupBisItemIdsByBossForDungeon,
  groupBisItemIdsByBossForDungeonWithFallback,
} from "./item-drop-sources.ts";

describe("item-drop-sources", () => {
  it("formats ICC heroic drop source as export-style raid label", () => {
    const sources = getFormattedItemDropSources(50709, "en");
    expect(sources).toEqual([
      {
        bossName: "Lord Marrowgar",
        raidLabel: "ICC25H",
        source: {
          bossName: "Lord Marrowgar",
          raidKey: "icecrownCitadel",
          size: 25,
          difficulty: DungeonDifficulty.HEROIC,
        },
      },
    ]);
    expect(formatItemDropSourceLine(sources[0]!.source, "en")).toBe(
      "ICC25H · Lord Marrowgar",
    );
  });

  it("groups BiS item ids by boss for a matching dungeon row", () => {
    const groups = groupBisItemIdsByBossForDungeon(
      [50709, 54581],
      {
        name: "Цитадель Ледяной Короны",
        shortName: "ЦЛК",
        raidKey: "icecrownCitadel",
        size: 25,
        difficulty: DungeonDifficulty.HEROIC,
      },
      "en",
    );

    expect(groups).toEqual([
      {
        bossName: "Lord Marrowgar",
        itemIds: [50709],
      },
    ]);
  });

  it("formats EN raid labels from English raid metadata", () => {
    expect(formatItemDropSourceLine(
      getFormattedItemDropSources(54581, "en")[0]!.source,
      "en",
    )).toBe("RS25H · Halion");
  });

  it("localizes boss names for RU locale", () => {
    expect(formatItemDropSourceLine(
      getFormattedItemDropSources(54581, "ru")[0]!.source,
      "ru",
    )).toBe("РС25хм · Халион");

    expect(formatItemDropSourceLine(
      getFormattedItemDropSources(50014, "ru")[0]!.source,
      "ru",
    )).toBe("ЦЛК25 · Саурфанг Смертоносный");
  });

  it("returns empty groups when dungeon raid does not match item sources", () => {
    const groups = groupBisItemIdsByBossForDungeon(
      [54581],
      {
        name: "Цитадель Ледяной Короны",
        shortName: "ЦЛК",
        raidKey: "icecrownCitadel",
        size: 25,
        difficulty: DungeonDifficulty.HEROIC,
      },
      "en",
    );

    expect(groups).toEqual([]);
  });

  it("groups Onyxia loot when dungeon row is marked Heroic (raid is Normal-only)", () => {
    const groups = groupBisItemIdsByBossForDungeon(
      [49306],
      {
        name: "Логово Ониксии",
        raidKey: "onyxiasLair",
        size: 10,
        difficulty: DungeonDifficulty.HEROIC,
      },
      "ru",
    );

    expect(groups.length).toBeGreaterThan(0);
    expect(groups[0]?.itemIds).toContain(49306);
  });

  it("falls back to a flat item list when boss drop metadata is missing", () => {
    const groups = groupBisItemIdsByBossForDungeonWithFallback(
      [49310],
      {
        name: "Логово Ониксии",
        raidKey: "onyxiasLair",
        size: 10,
        difficulty: DungeonDifficulty.NORMAL,
      },
      "ru",
    );

    expect(groups).toEqual([{ bossName: "", itemIds: [49310] }]);
  });
});
