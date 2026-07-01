import { describe, expect, it } from "vitest";
import { createAppTheme } from "../theme/create-app-theme.ts";
import {
  gearUpgradeHintDualCellSx,
  getGearHintCellBackgroundColor,
} from "./gear-hint-display.ts";

const dungeonItemLevels = [271, 284] as const;

function resolveDualCellBackground(
  mainDisplay: Parameters<typeof gearUpgradeHintDualCellSx>[0],
  offDisplay: Parameters<typeof gearUpgradeHintDualCellSx>[1],
): string | undefined {
  const theme = createAppTheme("light");
  const sx = gearUpgradeHintDualCellSx(
    mainDisplay,
    offDisplay,
    dungeonItemLevels,
  );
  const resolved = typeof sx === "function" ? sx(theme) : sx;
  return resolved.background as string | undefined;
}

describe("gearUpgradeHintDualCellSx", () => {
  it("tints only the left half when only main has a hint", () => {
    const background = resolveDualCellBackground(
      { kind: "ilvl", level: 2 },
      null,
    );

    expect(background).toMatch(/^linear-gradient\(to right,/);
    expect(background).toContain("50%, transparent 50%");
    expect(background).not.toContain("transparent 50%, transparent");
  });

  it("tints only the right half when only off has a hint", () => {
    const background = resolveDualCellBackground(
      null,
      { kind: "bis", level: 1 },
    );

    expect(background).toMatch(/^linear-gradient\(to right, transparent 50%,/);
    expect(background).toContain("50%)");
  });

  it("splits tint when both specs have hints", () => {
    const theme = createAppTheme("light");
    const mainColor = getGearHintCellBackgroundColor(
      { kind: "ilvl", level: 2 },
      theme,
    );
    const offColor = getGearHintCellBackgroundColor(
      { kind: "bis", level: 1 },
      theme,
    );
    const background = resolveDualCellBackground(
      { kind: "ilvl", level: 2 },
      { kind: "bis", level: 1 },
    );

    expect(background).toBe(
      `linear-gradient(to right, ${mainColor} 50%, ${offColor} 50%)`,
    );
  });
});

describe("getGearHintCellBackgroundColor", () => {
  it("uses stronger level-1 alphas in light mode than before", () => {
    const theme = createAppTheme("light");
    const bisLevel1 = getGearHintCellBackgroundColor(
      { kind: "bis", level: 1 },
      theme,
    );
    const ilvlLevel1 = getGearHintCellBackgroundColor(
      { kind: "ilvl", level: 1 },
      theme,
    );

    expect(bisLevel1).toBe("rgba(237, 108, 2, 0.22)");
    expect(ilvlLevel1).toBe("rgba(2, 132, 199, 0.18)");
  });

  it("uses higher alphas in dark mode than light for the same hint level", () => {
    const lightTheme = createAppTheme("light");
    const darkTheme = createAppTheme("dark");

    for (const display of [
      { kind: "bis" as const, level: 1 as const },
      { kind: "bis" as const, level: 3 as const },
      { kind: "ilvl" as const, level: 1 as const },
      { kind: "ilvl" as const, level: 3 as const },
    ]) {
      const lightColor = getGearHintCellBackgroundColor(display, lightTheme)!;
      const darkColor = getGearHintCellBackgroundColor(display, darkTheme)!;

      expect(lightColor).toMatch(/^rgba\(/);
      expect(darkColor).toMatch(/^rgba\(/);
      expect(lightColor).not.toEqual(darkColor);
      expect(darkColor.split(",")[3]).not.toEqual(lightColor.split(",")[3]);
    }
  });
});
