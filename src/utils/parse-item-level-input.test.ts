import { describe, expect, it } from "vitest";
import { parseItemLevelInput } from "./parse-item-level-input.ts";

describe("parseItemLevelInput", () => {
  it("parses a single item level", () => {
    expect(parseItemLevelInput("200")).toEqual([200]);
  });

  it("parses slash-separated ranges", () => {
    expect(parseItemLevelInput("200 / 213")).toEqual([200, 213]);
  });

  it("parses comma-separated values", () => {
    expect(parseItemLevelInput("200, 213, 245")).toEqual([200, 213, 245]);
  });

  it("filters non-numeric segments", () => {
    expect(parseItemLevelInput("200 / abc / 213")).toEqual([200, 213]);
  });
});
