import { describe, expect, it } from "vitest";
import { filterDungeonsByName } from "./filter-dungeons-by-name.ts";
import { createTestDungeon } from "../test/fixtures.ts";

describe("filterDungeonsByName", () => {
  const dungeons = [
    createTestDungeon({ name: "Icecrown Citadel", shortName: "ICC" }),
    createTestDungeon({ name: "Ulduar", shortName: "Uld" }),
  ];

  it("returns full list when query is empty", () => {
    expect(filterDungeonsByName(dungeons, "")).toEqual(dungeons);
    expect(filterDungeonsByName(dungeons, "   ")).toEqual(dungeons);
  });

  it("matches full dungeon name", () => {
    expect(filterDungeonsByName(dungeons, "icecrown")).toEqual([dungeons[0]]);
  });

  it("matches short name", () => {
    expect(filterDungeonsByName(dungeons, "uld")).toEqual([dungeons[1]]);
  });
});
