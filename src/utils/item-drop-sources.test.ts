import { describe, expect, it } from "vitest";
import { DungeonDifficulty } from "../types/dungeons.ts";
import {
  formatItemDropSourceLine,
  filterRaidLootItemIdsForDungeon,
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

  it("filters raid loot by dungeon size and difficulty", () => {
    const rs10Heroic = {
      name: "The Ruby Sanctum",
      raidKey: "rubySanctum" as const,
      size: 10 as const,
      difficulty: DungeonDifficulty.HEROIC,
    };

    expect(
      filterRaidLootItemIdsForDungeon([53126, 54559], rs10Heroic),
    ).toEqual([54559]);
    expect(
      filterRaidLootItemIdsForDungeon([53103, 53112], {
        ...rs10Heroic,
        difficulty: DungeonDifficulty.NORMAL,
      }),
    ).toEqual([53103, 53112]);
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

  it("groups Vault of Archavon tier loot by Toravon for a matching 10-man row", () => {
    const groups = groupBisItemIdsByBossForDungeon(
      [50079],
      {
        name: "Vault of Archavon",
        raidKey: "vaultOfArchavon",
        size: 10,
        difficulty: DungeonDifficulty.NORMAL,
      },
      "en",
    );

    expect(groups).toEqual([
      {
        bossName: "Toravon the Ice Watcher",
        itemIds: [50079],
      },
    ]);
  });

  it("localizes Vault of Archavon boss names for RU locale", () => {
    const groups = groupBisItemIdsByBossForDungeon(
      [47752],
      {
        name: "Склеп Аркавона",
        raidKey: "vaultOfArchavon",
        size: 10,
        difficulty: DungeonDifficulty.NORMAL,
      },
      "ru",
    );

    expect(groups).toEqual([
      {
        bossName: "Коралон Страж Пламени",
        itemIds: [47752],
      },
    ]);
  });
});
