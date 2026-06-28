import { describe, expect, it } from "vitest";
import { DungeonDifficulty } from "../types/dungeons.ts";
import {
  formatItemDropSourceLine,
  getFormattedItemDropSources,
  groupBisItemIdsByBossForDungeon,
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
});
