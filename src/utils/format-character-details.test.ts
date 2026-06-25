import { describe, expect, it } from "vitest";
import {
  formatCharacterSpecGearSummary,
  formatCompactGearScore,
  formatSpecGearLine,
} from "./format-character-details.ts";

describe("formatCompactGearScore", () => {
  it("returns the value unchanged below 1000", () => {
    expect(formatCompactGearScore(999)).toBe("999");
  });

  it("formats thousands with one decimal when needed", () => {
    expect(formatCompactGearScore(6615)).toBe("6.6k");
    expect(formatCompactGearScore(6500)).toBe("6.5k");
  });

  it("formats whole thousands without a decimal", () => {
    expect(formatCompactGearScore(6000)).toBe("6k");
    expect(formatCompactGearScore(10000)).toBe("10k");
  });

  it("rounds down fractional thousands", () => {
    expect(formatCompactGearScore(5599)).toBe("5.5k");
    expect(formatCompactGearScore(6650)).toBe("6.6k");
  });
});

describe("formatSpecGearLine", () => {
  it("uses compact gear score formatting", () => {
    expect(formatSpecGearLine({ spec: "Unholy", gearScore: 6615 })).toBe(
      "Unholy · 6.6k",
    );
  });
});

describe("formatCharacterSpecGearSummary", () => {
  it("joins main and off spec lines with compact gear scores", () => {
    expect(
      formatCharacterSpecGearSummary({
        mainSpec: { spec: "Unholy", gearScore: 6615 },
        offSpec: { spec: "Blood", gearScore: 6023 },
      }),
    ).toBe("Unholy · 6.6k / Blood · 6k");
  });
});
