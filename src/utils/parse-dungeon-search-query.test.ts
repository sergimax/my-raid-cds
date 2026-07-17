import { describe, expect, it } from "vitest";
import { DungeonDifficulty } from "../types/dungeons.ts";
import { parseDungeonSearchQuery } from "./parse-dungeon-search-query.ts";

describe("parseDungeonSearchQuery", () => {
  it("returns empty name for blank query", () => {
    expect(parseDungeonSearchQuery("")).toEqual({ nameQuery: "" });
    expect(parseDungeonSearchQuery("   ")).toEqual({ nameQuery: "" });
  });

  it("parses name-only query", () => {
    expect(parseDungeonSearchQuery("ICC")).toEqual({ nameQuery: "icc" });
    expect(parseDungeonSearchQuery("icecrown")).toEqual({ nameQuery: "icecrown" });
  });

  it("parses name with size", () => {
    expect(parseDungeonSearchQuery("ICC25")).toEqual({
      nameQuery: "icc",
      size: 25,
    });
    expect(parseDungeonSearchQuery("ICC 25")).toEqual({
      nameQuery: "icc",
      size: 25,
    });
  });

  it("parses name with size and Latin mode suffixes", () => {
    expect(parseDungeonSearchQuery("ICC25H")).toEqual({
      nameQuery: "icc",
      size: 25,
      difficulty: DungeonDifficulty.HEROIC,
    });
    expect(parseDungeonSearchQuery("icc25h")).toEqual({
      nameQuery: "icc",
      size: 25,
      difficulty: DungeonDifficulty.HEROIC,
    });
    expect(parseDungeonSearchQuery("ICC25N")).toEqual({
      nameQuery: "icc",
      size: 25,
      difficulty: DungeonDifficulty.NORMAL,
    });
    expect(parseDungeonSearchQuery("icc25n")).toEqual({
      nameQuery: "icc",
      size: 25,
      difficulty: DungeonDifficulty.NORMAL,
    });
  });

  it("parses Russian mode suffixes", () => {
    expect(parseDungeonSearchQuery("ЦЛК25хм")).toEqual({
      nameQuery: "цлк",
      size: 25,
      difficulty: DungeonDifficulty.HEROIC,
    });
    expect(parseDungeonSearchQuery("цлк25х")).toEqual({
      nameQuery: "цлк",
      size: 25,
      difficulty: DungeonDifficulty.HEROIC,
    });
    expect(parseDungeonSearchQuery("ЦЛК25об")).toEqual({
      nameQuery: "цлк",
      size: 25,
      difficulty: DungeonDifficulty.NORMAL,
    });
    expect(parseDungeonSearchQuery("цлк25об")).toEqual({
      nameQuery: "цлк",
      size: 25,
      difficulty: DungeonDifficulty.NORMAL,
    });
  });

  it("parses size-only and size with mode suffix", () => {
    expect(parseDungeonSearchQuery("25")).toEqual({ nameQuery: "", size: 25 });
    expect(parseDungeonSearchQuery("25h")).toEqual({
      nameQuery: "",
      size: 25,
      difficulty: DungeonDifficulty.HEROIC,
    });
    expect(parseDungeonSearchQuery("25n")).toEqual({
      nameQuery: "",
      size: 25,
      difficulty: DungeonDifficulty.NORMAL,
    });
  });

  it("prefers longest valid trailing size", () => {
    expect(parseDungeonSearchQuery("icc10")).toEqual({
      nameQuery: "icc",
      size: 10,
    });
    expect(parseDungeonSearchQuery("icc5")).toEqual({
      nameQuery: "icc",
      size: 5,
    });
  });
});
