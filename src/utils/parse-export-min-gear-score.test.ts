import { describe, expect, it } from "vitest";
import {
  compactExportMinGearScoreToThreshold,
  normalizeExportMinGearScoreInput,
  parseExportMinGearScore,
  resolveExportMinGearScoreThreshold,
} from "./parse-export-min-gear-score.ts";

describe("normalizeExportMinGearScoreInput", () => {
  it("strips common raid-chat GS suffixes", () => {
    expect(normalizeExportMinGearScoreInput("5.6gs")).toBe("5.6");
    expect(normalizeExportMinGearScoreInput("5.6Gs")).toBe("5.6");
    expect(normalizeExportMinGearScoreInput("5.6k")).toBe("5.6");
    expect(normalizeExportMinGearScoreInput("5.6к")).toBe("5.6");
  });
});

describe("parseExportMinGearScore", () => {
  it("returns undefined for empty input", () => {
    expect(parseExportMinGearScore("")).toBeUndefined();
    expect(parseExportMinGearScore("   ")).toBeUndefined();
  });

  it("parses full gear score values", () => {
    expect(parseExportMinGearScore("5600")).toBe(5600);
    expect(parseExportMinGearScore("6615")).toBe(6615);
  });

  it("parses compact shorthand like raid recruit posts", () => {
    expect(parseExportMinGearScore("5.6")).toBe(5600);
    expect(parseExportMinGearScore("4.8")).toBe(4800);
    expect(parseExportMinGearScore("6")).toBe(6000);
    expect(parseExportMinGearScore("5.6gs")).toBe(5600);
    expect(parseExportMinGearScore("4.8к")).toBe(4800);
  });

  it("returns NaN for invalid or out-of-range values", () => {
    expect(parseExportMinGearScore("abc")).toBeNaN();
    expect(parseExportMinGearScore("0")).toBeNaN();
    expect(parseExportMinGearScore("55")).toBeNaN();
    expect(parseExportMinGearScore("7001")).toBeNaN();
  });
});

describe("compactExportMinGearScoreToThreshold", () => {
  it("converts compact slider values to numeric thresholds", () => {
    expect(compactExportMinGearScoreToThreshold(5.6)).toBe(5600);
    expect(compactExportMinGearScoreToThreshold(6)).toBe(6000);
  });
});

describe("resolveExportMinGearScoreThreshold", () => {
  it("returns undefined when the filter is disabled", () => {
    expect(resolveExportMinGearScoreThreshold(false, 5.6)).toBeUndefined();
  });

  it("returns the threshold when the filter is enabled", () => {
    expect(resolveExportMinGearScoreThreshold(true, 5.6)).toBe(5600);
  });
});
