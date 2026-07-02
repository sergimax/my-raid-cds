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

  it("parses name with size and Latin heroic suffix", () => {
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
  });

  it("parses Russian heroic suffixes", () => {
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
  });

  it("parses size-only and size with heroic suffix", () => {
    expect(parseDungeonSearchQuery("25")).toEqual({ nameQuery: "", size: 25 });
    expect(parseDungeonSearchQuery("25h")).toEqual({
      nameQuery: "",
      size: 25,
      difficulty: DungeonDifficulty.HEROIC,
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
