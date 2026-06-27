import { describe, expect, it } from "vitest";
import { DungeonDifficulty } from "../types/dungeons.ts";
import { createTestDungeon } from "../test/fixtures.ts";
import { compareDungeonType, formatDungeonTypeLabel } from "./dungeon-type.ts";
import { sortDungeons } from "./sort-dungeons.ts";

describe("formatDungeonTypeLabel", () => {
  it("formats normal as size only", () => {
    expect(
      formatDungeonTypeLabel({
        size: 25,
        difficulty: DungeonDifficulty.NORMAL,
      }),
    ).toBe("25");
  });

  it("formats heroic with H suffix in English", () => {
    expect(
      formatDungeonTypeLabel(
        { size: 10, difficulty: DungeonDifficulty.HEROIC },
        "en",
      ),
    ).toBe("10H");
  });

  it("formats heroic with хм suffix in Russian", () => {
    expect(
      formatDungeonTypeLabel(
        { size: 25, difficulty: DungeonDifficulty.HEROIC },
        "ru",
      ),
    ).toBe("25хм");
  });

  it("formats heroic table label with skull marker", () => {
    expect(
      formatDungeonTypeLabel(
        { size: 10, difficulty: DungeonDifficulty.HEROIC },
        "en",
        "skull",
        "☠️",
      ),
    ).toBe("10 ☠️");
  });
});

describe("dungeonTypeSortRank", () => {
  it("orders 25H above 25 above 10H above 10 above 5 above 40 above 20", () => {
    const types = [
      createTestDungeon({ id: "20", size: 20, difficulty: DungeonDifficulty.NORMAL }),
      createTestDungeon({ id: "40", size: 40, difficulty: DungeonDifficulty.NORMAL }),
      createTestDungeon({ id: "5", size: 5, difficulty: DungeonDifficulty.NORMAL }),
      createTestDungeon({ id: "10n", size: 10, difficulty: DungeonDifficulty.NORMAL }),
      createTestDungeon({ id: "10h", size: 10, difficulty: DungeonDifficulty.HEROIC }),
      createTestDungeon({ id: "25n", size: 25, difficulty: DungeonDifficulty.NORMAL }),
      createTestDungeon({ id: "25h", size: 25, difficulty: DungeonDifficulty.HEROIC }),
    ];

    const sorted = [...types].sort(compareDungeonType);
    expect(sorted.map((dungeon) => dungeon.id)).toEqual([
      "20",
      "40",
      "5",
      "10n",
      "10h",
      "25n",
      "25h",
    ]);
  });
});

describe("sortDungeons by type", () => {
  it("sorts descending with 25H first", () => {
    const dungeons = [
      createTestDungeon({ id: "10n", name: "ToC10", size: 10, difficulty: DungeonDifficulty.NORMAL }),
      createTestDungeon({ id: "25h", name: "ICC25H", size: 25, difficulty: DungeonDifficulty.HEROIC }),
      createTestDungeon({ id: "5", name: "Dungeon", size: 5, difficulty: DungeonDifficulty.NORMAL }),
    ];

    const sorted = sortDungeons(dungeons, "type", "desc");
    expect(sorted.map((dungeon) => dungeon.id)).toEqual(["25h", "10n", "5"]);
  });
});
