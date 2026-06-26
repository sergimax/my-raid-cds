import { describe, expect, it } from "vitest";
import { ClassName } from "../types/characters.ts";
import { parseWowSimsExporterJson } from "./parse-wowsims-exporter.ts";
import { summarizeGearItemLevels } from "./summarize-gear-item-levels.ts";

const RHEE_EXPORT = JSON.stringify({
  talents:
    "0530310520000000000000000-30205033005021333031131031051-00000000000000000000000000",
  glyphs: { major: [], minor: [] },
  class: "shaman",
  race: "Draenei",
  name: "Rhee",
  gear: {
    items: [
      { enchant: 3817, gems: [41398, 40118], id: 51197 },
      { enchant: 0, gems: [40162], id: 50452 },
      { enchant: 3808, gems: [40162], id: 51199 },
      { enchant: 3605, gems: [40162], id: 49998 },
      { enchant: 0, gems: [40162, 49110], id: 51195 },
      { enchant: 3845, gems: [40118], id: 53126 },
      { enchant: 3604, gems: [40118], id: 50831 },
      { enchant: 0, gems: [40159, 40159, 40157], id: 50993 },
      { enchant: 3823, gems: [40118, 40125], id: 51198 },
      { enchant: 3606, gems: [40162, 40162], id: 53127 },
      { enchant: 0, gems: [40159], id: 50604 },
      { enchant: 0, gems: [40125], id: 50402 },
      { enchant: 0, gems: [], id: 50362 },
      { enchant: 0, gems: [], id: 50355 },
      { enchant: 3789, gems: [], id: 50426 },
      { enchant: 3789, gems: [], id: 50016 },
      { enchant: 0, gems: [], id: 50458 },
    ],
  },
  professions: [],
  level: 80,
  spec: "enhancement",
});

describe("parseWowSimsExporterJson", () => {
  it("parses equipped items, class, and spec from export JSON", () => {
    const result = parseWowSimsExporterJson(RHEE_EXPORT, ClassName.Shaman);
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.gearItems).toHaveLength(17);
    expect(result.gearItems[0]).toEqual({
      slot: 0,
      id: 51197,
      enchant: 3817,
      gems: [41398, 40118],
    });
    expect(result.exportClass).toBe(ClassName.Shaman);
    expect(result.exportSpec).toBe("Enhancement");
    expect(result.exportName).toBe("Rhee");
    expect(result.warnings).toEqual([]);
  });

  it("skips empty slots and rejects invalid JSON", () => {
    const withNull = JSON.stringify({
      class: "paladin",
      gear: {
        items: [{ id: 41386 }, null, { id: 40578 }],
      },
    });
    const parsed = parseWowSimsExporterJson(withNull);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.gearItems).toEqual([
        { slot: 0, id: 41386 },
        { slot: 2, id: 40578 },
      ]);
    }

    expect(parseWowSimsExporterJson("{bad").ok).toBe(false);
    expect(parseWowSimsExporterJson("{}").ok).toBe(false);
  });

  it("warns when export class differs from the edited character", () => {
    const result = parseWowSimsExporterJson(RHEE_EXPORT, ClassName.Paladin);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.warnings.some((warning) => warning.includes("Shaman"))).toBe(
        true,
      );
    }
  });
});

describe("summarizeGearItemLevels", () => {
  it("derives average item level from imported gear", () => {
    const parsed = parseWowSimsExporterJson(RHEE_EXPORT, ClassName.Shaman);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) {
      return;
    }

    const summary = summarizeGearItemLevels(parsed.gearItems);
    expect(summary.equippedCount).toBe(17);
    expect(summary.unknownItemIds).toEqual([]);
    expect(summary.averageItemLevel).toBe(266);
  });
});
