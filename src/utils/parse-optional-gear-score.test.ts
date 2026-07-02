import { describe, expect, it } from "vitest";
import {
  MAX_CHARACTER_GEAR_SCORE,
  MIN_CHARACTER_GEAR_SCORE,
} from "../constants/character.ts";
import { parseOptionalGearScore } from "./parse-optional-gear-score.ts";

describe("parseOptionalGearScore", () => {
  it("returns undefined for empty input", () => {
    expect(parseOptionalGearScore("")).toBeUndefined();
    expect(parseOptionalGearScore("   ")).toBeUndefined();
  });

  it("parses valid whole-number gear scores", () => {
    expect(parseOptionalGearScore("6000")).toBe(6000);
    expect(parseOptionalGearScore("6615")).toBe(6615);
  });

  it("returns NaN for invalid or out-of-range values", () => {
    expect(parseOptionalGearScore("6.6")).toBeNaN();
    expect(parseOptionalGearScore("0")).toBeNaN();
    expect(parseOptionalGearScore(String(MIN_CHARACTER_GEAR_SCORE - 1))).toBeNaN();
    expect(parseOptionalGearScore(String(MAX_CHARACTER_GEAR_SCORE + 1))).toBeNaN();
  });
});
