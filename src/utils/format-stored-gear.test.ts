import { describe, expect, it } from "vitest";
import { ClassName } from "../types/characters.ts";
import {
  formatGearSummary,
  formatStoredGearItemLine,
  sortGearItemsBySlot,
} from "./format-stored-gear.ts";
import { parseWowSimsExporterJson } from "./parse-wowsims-exporter.ts";

const RHEE_EXPORT = JSON.stringify({
  class: "shaman",
  gear: {
    items: [
      { id: 51197 },
      { id: 50452 },
      { id: 51199 },
    ],
  },
});

describe("formatStoredGearItemLine", () => {
  it("includes slot label, item id, and item level", () => {
    expect(formatStoredGearItemLine({ slot: 0, id: 51197 })).toBe(
      "Head · Sanctified Frost Witch's Faceguard · ilvl 264",
    );
  });

  it("shows unknown item level when id is missing from the database", () => {
    expect(formatStoredGearItemLine({ slot: 14, id: 99999999 })).toBe(
      "Main hand · 99999999 · ilvl ?",
    );
  });
});

describe("formatGearSummary", () => {
  it("summarizes imported gear for notices", () => {
    const parsed = parseWowSimsExporterJson(RHEE_EXPORT, ClassName.Shaman);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) {
      return;
    }

    expect(formatGearSummary(parsed.gearItems)).toBe("3 items · avg ilvl 264");
  });
});

describe("sortGearItemsBySlot", () => {
  it("orders gear by slot index", () => {
    expect(
      sortGearItemsBySlot([
        { slot: 14, id: 1 },
        { slot: 0, id: 2 },
        { slot: 7, id: 3 },
      ]).map((item) => item.slot),
    ).toEqual([0, 7, 14]);
  });
});
