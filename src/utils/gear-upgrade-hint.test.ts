import { describe, expect, it } from "vitest";
import { ClassName } from "../types/characters.ts";
import { DungeonDifficulty } from "../types/dungeons.ts";
import { unholyDeathKnightBis } from "../data/bis-presets/unholy-death-knight.ts";
import { createTestDungeon } from "../test/fixtures.ts";
import { buildBisSlotMap } from "./bis-lists.ts";
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

const emptyHintExtras = {
  slotAware: false,
  bisFiltered: false,
  upgradeSlots: [],
} as const;

describe("getDungeonPeakItemLevel", () => {
  it("returns the highest ilvl in the dungeon row", () => {
    expect(getDungeonPeakItemLevel([264, 271])).toBe(271);
    expect(getDungeonPeakItemLevel([284])).toBe(284);
  });
});

describe("evaluateGearUpgradeHint", () => {
  it("returns no hint when the character has no imported gear", () => {
    expect(
      evaluateGearUpgradeHint(undefined, {
        name: "Цитадель Ледяной Короны",
        raidKey: "icecrownCitadel",
        itemLevel: [277, 284],
      }),
    ).toEqual({
      level: 0,
      upgradeSlotCount: 0,
      equippedCount: 0,
      peakDungeonItemLevel: 284,
      ...emptyHintExtras,
    });
  });

  it("returns no hint when all gear meets the dungeon peak ilvl", () => {
    expect(
      evaluateGearUpgradeHint([{ slot: 0, id: 51197 }], {
        name: "Цитадель Ледяной Короны",
        raidKey: "icecrownCitadel",
        itemLevel: [264, 264],
      }),
    ).toEqual({
      level: 0,
      upgradeSlotCount: 0,
      equippedCount: 1,
      peakDungeonItemLevel: 264,
      slotAware: true,
      bisFiltered: false,
      upgradeSlots: [],
    });
  });

  it("flags high upgrade potential for BiS-ish gear vs top-tier raids", () => {
    const parsed = parseWowSimsExporterJson(RHEE_EXPORT, ClassName.Shaman);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) {
      return;
    }

    const iccHint = evaluateGearUpgradeHint(parsed.gearItems, {
      name: "Цитадель Ледяной Короны",
      raidKey: "icecrownCitadel",
      itemLevel: [277, 284],
    });
    expect(iccHint.slotAware).toBe(true);
    expect(iccHint.upgradeSlotCount).toBeGreaterThan(0);
    expect(iccHint.level).toBeGreaterThanOrEqual(2);

    const naxxHint = evaluateGearUpgradeHint(parsed.gearItems, {
      name: "Наксрамас",
      raidKey: "naxxramas",
      itemLevel: [213],
    });
    expect(naxxHint.level).toBe(0);
  });

  it("does not treat weapon slots as upgradeable in Ruby Sanctum", () => {
    const parsed = parseWowSimsExporterJson(RHEE_EXPORT, ClassName.Shaman);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) {
      return;
    }

    const rsHint = evaluateGearUpgradeHint(parsed.gearItems, {
      name: "Рубиновое святилище",
      raidKey: "rubySanctum",
      itemLevel: [284],
    });

    expect(rsHint.slotAware).toBe(true);
    expect(rsHint.upgradeSlots.some((slotHint) => slotHint.slot === 14)).toBe(
      false,
    );
    expect(rsHint.upgradeSlots.some((slotHint) => slotHint.slot === 15)).toBe(
      false,
    );
    expect(rsHint.upgradeSlotCount).toBeGreaterThan(0);
  });

  it("filters upgrades to BiS items for the selected spec list", () => {
    const priestNeckOnly = buildBisSlotMap({
      id: "local-priest",
      name: "Shadow priest",
      slots: [{ slot: 1, itemIds: [50647] }],
    });

    const rsHint = evaluateGearUpgradeHint(
      [{ slot: 1, id: 50452 }],
      {
        name: "Рубиновое святилище",
        raidKey: "rubySanctum",
        itemLevel: [284],
      },
      priestNeckOnly,
    );

    expect(rsHint.bisFiltered).toBe(true);
    expect(rsHint.upgradeSlotCount).toBe(0);
  });

  it("uses BiS targets for Unholy DK neck upgrades in Ruby Sanctum", () => {
    const unholyBis = buildBisSlotMap(unholyDeathKnightBis.presets[0]);
    const rsHint = evaluateGearUpgradeHint(
      [{ slot: 1, id: 50452 }],
      {
        name: "Рубиновое святилище",
        raidKey: "rubySanctum",
        itemLevel: [284],
      },
      unholyBis,
    );

    expect(rsHint.bisFiltered).toBe(true);
    expect(rsHint.upgradeSlotCount).toBe(1);
    expect(rsHint.upgradeSlots[0]?.bestLootItemId).toBe(54581);
  });

  it("flags missing BiS targets even when equipped gear is higher ilvl", () => {
    const bryntrollBis = buildBisSlotMap({
      id: "local-uhdk-bryn",
      name: "with bryn",
      slots: [{ slot: 14, itemIds: [50709] }],
    });

    const iccHint = evaluateGearUpgradeHint(
      [{ slot: 14, id: 49623 }],
      {
        name: "ICC25 HM",
        raidKey: "icecrownCitadel",
        itemLevel: [277, 284],
      },
      bryntrollBis,
    );

    expect(iccHint.bisFiltered).toBe(true);
    expect(iccHint.upgradeSlotCount).toBe(1);
    expect(iccHint.upgradeSlots[0]?.bestLootItemId).toBe(50709);
  });

  it("does not flag a slot when equipped gear matches the active BiS list", () => {
    const shadowmourneBis = buildBisSlotMap({
      id: "default",
      name: "Default",
      slots: [{ slot: 14, itemIds: [49623] }],
    });

    const iccHint = evaluateGearUpgradeHint(
      [{ slot: 14, id: 49623 }],
      {
        name: "ICC25 HM",
        raidKey: "icecrownCitadel",
        itemLevel: [277, 284],
      },
      shadowmourneBis,
    );

    expect(iccHint.bisFiltered).toBe(true);
    expect(iccHint.upgradeSlotCount).toBe(0);
  });

  it("falls back to ilvl-only hints for custom dungeons without raid loot", () => {
    const hint = evaluateGearUpgradeHint([{ slot: 14, id: 50426 }], {
      name: "Custom dungeon",
      itemLevel: [300],
    });

    expect(hint.slotAware).toBe(false);
    expect(hint.upgradeSlotCount).toBe(1);
  });

  it("resolves raid loot from the Russian dungeon name when raidKey is missing", () => {
    const dungeon = createTestDungeon({
      name: "Рубиновое святилище",
      itemLevel: [284],
      difficulty: DungeonDifficulty.HEROIC,
    });

    const hint = evaluateGearUpgradeHint([{ slot: 14, id: 50426 }], dungeon);
    expect(hint.slotAware).toBe(true);
    expect(hint.upgradeSlotCount).toBe(0);
  });
});

describe("formatGearUpgradeHintTooltip", () => {
  it("lists upgrade slots with item names when loot data is available", () => {
    const tooltip = formatGearUpgradeHintTooltip({
      level: 2,
      upgradeSlotCount: 2,
      equippedCount: 17,
      peakDungeonItemLevel: 284,
      slotAware: true,
      bisFiltered: true,
      upgradeSlots: [
        { slot: 12, bestLootItemId: 54569, bestLootItemLevel: 284 },
        { slot: 1, bestLootItemId: 54581, bestLootItemLevel: 284 },
      ],
    });

    expect(tooltip).toContain("2 BiS slot(s) missing targets");
    expect(tooltip).toContain("Trinket 1");
    expect(tooltip).toContain("→");
  });
});
