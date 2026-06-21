import { describe, expect, it } from "vitest";
import { DungeonDifficulty } from "../types/dungeons.ts";
import {
  defaultSortDirectionForKey,
  sortDungeons,
  sortDungeonsByCharacterToggle,
} from "./sort-dungeons.ts";
import {
  createTestCharacter,
  createTestDungeon,
  createTestToggles,
} from "../test/fixtures.ts";

describe("defaultSortDirectionForKey", () => {
  it("uses desc for item level and completions", () => {
    expect(defaultSortDirectionForKey("itemLevel")).toBe("desc");
    expect(defaultSortDirectionForKey("completions")).toBe("desc");
  });

  it("uses asc for other keys", () => {
    expect(defaultSortDirectionForKey("name")).toBe("asc");
    expect(defaultSortDirectionForKey("size")).toBe("asc");
  });
});

describe("sortDungeons", () => {
  const dungeons = [
    createTestDungeon({ id: "b", name: "Beta", size: 10 }),
    createTestDungeon({ id: "a", name: "Alpha", size: 25 }),
  ];

  it("sorts by name ascending", () => {
    const sorted = sortDungeons(dungeons, "name", "asc");
    expect(sorted.map((dungeon) => dungeon.name)).toEqual(["Alpha", "Beta"]);
  });

  it("sorts by size descending", () => {
    const sorted = sortDungeons(dungeons, "size", "desc");
    expect(sorted.map((dungeon) => dungeon.size)).toEqual([25, 10]);
  });

  it("sorts by difficulty with normal before heroic", () => {
    const mixed = [
      createTestDungeon({
        id: "heroic",
        name: "Raid",
        difficulty: DungeonDifficulty.HEROIC,
      }),
      createTestDungeon({
        id: "normal",
        name: "Raid",
        difficulty: DungeonDifficulty.NORMAL,
      }),
    ];
    const sorted = sortDungeons(mixed, "difficulty", "asc");
    expect(sorted.map((dungeon) => dungeon.difficulty)).toEqual([
      DungeonDifficulty.NORMAL,
      DungeonDifficulty.HEROIC,
    ]);
  });

  it("sorts by item level using starting tier", () => {
    const mixed = [
      createTestDungeon({ id: "low", name: "Low", itemLevel: [200] }),
      createTestDungeon({ id: "high", name: "High", itemLevel: [264, 277] }),
    ];
    const sorted = sortDungeons(mixed, "itemLevel", "desc");
    expect(sorted.map((dungeon) => dungeon.id)).toEqual(["high", "low"]);
  });

  it("sorts by completion counts", () => {
    const mixed = [
      createTestDungeon({ id: "few", name: "Few" }),
      createTestDungeon({ id: "many", name: "Many" }),
    ];
    const sorted = sortDungeons(mixed, "completions", "desc", {
      few: 1,
      many: 3,
    });
    expect(sorted.map((dungeon) => dungeon.id)).toEqual(["many", "few"]);
  });
});

describe("sortDungeonsByCharacterToggle", () => {
  it("sorts off toggles before on toggles ascending", () => {
    const character = createTestCharacter({ id: "character-1" });
    const dungeons = [
      createTestDungeon({ id: "on", name: "On Raid" }),
      createTestDungeon({ id: "off", name: "Off Raid" }),
    ];
    const toggles = createTestToggles([
      { characterId: character.id, dungeonId: "on", on: true },
      { characterId: character.id, dungeonId: "off", on: false },
    ]);

    const sorted = sortDungeonsByCharacterToggle(
      dungeons,
      character.id,
      "asc",
      toggles,
    );
    expect(sorted.map((dungeon) => dungeon.id)).toEqual(["off", "on"]);
  });
});
