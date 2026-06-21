import { describe, expect, it } from "vitest";
import {
  countCompletedForCharacter,
  countCompletedForDungeon,
} from "./completion-counts.ts";
import {
  createTestCharacter,
  createTestDungeon,
  createTestToggles,
} from "../test/fixtures.ts";

describe("countCompletedForCharacter", () => {
  it("counts dungeons with CD on for a character", () => {
    const dungeons = [
      createTestDungeon({ id: "dungeon-1" }),
      createTestDungeon({ id: "dungeon-2" }),
      createTestDungeon({ id: "dungeon-3" }),
    ];
    const toggles = createTestToggles([
      { characterId: "character-1", dungeonId: "dungeon-1", on: true },
      { characterId: "character-1", dungeonId: "dungeon-2", on: false },
      { characterId: "character-1", dungeonId: "dungeon-3", on: true },
    ]);

    expect(
      countCompletedForCharacter("character-1", dungeons, toggles),
    ).toBe(2);
  });
});

describe("countCompletedForDungeon", () => {
  it("counts characters with CD on for a dungeon", () => {
    const characters = [
      createTestCharacter({ id: "character-1" }),
      createTestCharacter({ id: "character-2" }),
    ];
    const toggles = createTestToggles([
      { characterId: "character-1", dungeonId: "dungeon-1", on: true },
      { characterId: "character-2", dungeonId: "dungeon-1", on: false },
    ]);

    expect(
      countCompletedForDungeon("dungeon-1", characters, toggles),
    ).toBe(1);
  });
});
