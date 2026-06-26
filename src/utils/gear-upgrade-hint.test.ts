import { describe, expect, it } from "vitest";
import { ClassName } from "../types/characters.ts";
import {
  evaluateGearUpgradeHint,
  formatGearUpgradeHintTooltip,
  getDungeonPeakItemLevel,
} from "./gear-upgrade-hint.ts";
import { parseWowSimsExporterJson } from "./parse-wowsims-exporter.ts";

const RHEE_EXPORT = JSON.stringify({
  class: "shaman",
  gear: {
    items: [
      { id: 51197 },
      { id: 50452 },
      { id: 51199 },
      { id: 49998 },
      { id: 51195 },
      { id: 53126 },
      { id: 50831 },
      { id: 50993 },
      { id: 51198 },
      { id: 53127 },
      { id: 50604 },
      { id: 50402 },
      { id: 50362 },
      { id: 50355 },
      { id: 50426 },
      { id: 50016 },
      { id: 50458 },
    ],
  },
});

describe("getDungeonPeakItemLevel", () => {
  it("returns the highest ilvl in the dungeon row", () => {
    expect(getDungeonPeakItemLevel([264, 271])).toBe(271);
    expect(getDungeonPeakItemLevel([284])).toBe(284);
  });
});

describe("evaluateGearUpgradeHint", () => {
  it("returns no hint when the character has no imported gear", () => {
    expect(evaluateGearUpgradeHint(undefined, [277, 284])).toEqual({
      level: 0,
      upgradeSlotCount: 0,
      equippedCount: 0,
      peakDungeonItemLevel: 284,
    });
  });

  it("returns no hint when all gear meets the dungeon peak ilvl", () => {
    expect(
      evaluateGearUpgradeHint([{ slot: 0, id: 51197 }], [264, 264]),
    ).toEqual({
      level: 0,
      upgradeSlotCount: 0,
      equippedCount: 1,
      peakDungeonItemLevel: 264,
    });
  });

  it("flags high upgrade potential for BiS-ish gear vs top-tier raids", () => {
    const parsed = parseWowSimsExporterJson(RHEE_EXPORT, ClassName.Shaman);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) {
      return;
    }

    const iccHint = evaluateGearUpgradeHint(parsed.gearItems, [277, 284]);
    expect(iccHint.upgradeSlotCount).toBeGreaterThan(0);
    expect(iccHint.level).toBeGreaterThanOrEqual(2);

    const naxxHint = evaluateGearUpgradeHint(parsed.gearItems, [213]);
    expect(naxxHint.level).toBe(0);
  });
});

describe("formatGearUpgradeHintTooltip", () => {
  it("describes how many items are below the dungeon peak", () => {
    expect(
      formatGearUpgradeHintTooltip({
        level: 3,
        upgradeSlotCount: 12,
        equippedCount: 17,
        peakDungeonItemLevel: 284,
      }),
    ).toBe("12 of 17 items below ilvl 284");
  });
});
