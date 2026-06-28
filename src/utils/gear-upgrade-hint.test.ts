import { describe, expect, it } from "vitest";
import { ClassName } from "../types/characters.ts";
import { DungeonDifficulty } from "../types/dungeons.ts";
import { unholyDeathKnightBis } from "../data/bis-presets/unholy-death-knight.ts";
import { retributionPaladinBis } from "../data/bis-presets/retribution-paladin.ts";
import { createTestDungeon } from "../test/fixtures.ts";
import { testTranslator } from "../test/i18n.ts";
import { buildBisSlotMap } from "./bis-lists.ts";
import {
  evaluateGearUpgradeHint,
  formatGearUpgradeHintTooltip,
  getDungeonPeakItemLevel,
  getGearHintCellBackgroundColor,
  getGearHintCellDisplay,
  type GearUpgradeHintTrack,
} from "./gear-upgrade-hint.ts";
import { createAppTheme } from "../theme/create-app-theme.ts";
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

const emptyTrack: GearUpgradeHintTrack = {
  level: 0,
  upgradeSlotCount: 0,
  upgradeSlots: [],
};

describe("getDungeonPeakItemLevel", () => {
  it("returns the highest ilvl in the dungeon row", () => {
    expect(getDungeonPeakItemLevel([264, 271])).toBe(271);
    expect(getDungeonPeakItemLevel([284])).toBe(284);
  });
});

describe("getGearHintCellDisplay", () => {
  it("prefers BiS tint when both BiS and ilvl tracks are active", () => {
    expect(
      getGearHintCellDisplay({
        bis: { level: 2, upgradeSlotCount: 1, upgradeSlots: [{ slot: 1 }] },
        bisVariant: emptyTrack,
        ilvl: { level: 3, upgradeSlotCount: 5, upgradeSlots: [] },
        equippedCount: 10,
        peakDungeonItemLevel: 284,
        slotAware: true,
        bisListActive: true,
      }),
    ).toEqual({ kind: "bis", level: 2 });
  });

  it("uses BiS variant track level for cell tint", () => {
    expect(
      getGearHintCellDisplay({
        bis: emptyTrack,
        bisVariant: { level: 2, upgradeSlotCount: 1, upgradeSlots: [{ slot: 7 }] },
        ilvl: emptyTrack,
        equippedCount: 10,
        peakDungeonItemLevel: 264,
        slotAware: true,
        bisListActive: true,
      }),
    ).toEqual({ kind: "bis", level: 2 });
  });

  it("falls back to ilvl tint when BiS list is inactive", () => {
    expect(
      getGearHintCellDisplay({
        bis: emptyTrack,
        bisVariant: emptyTrack,
        ilvl: { level: 2, upgradeSlotCount: 3, upgradeSlots: [] },
        equippedCount: 10,
        peakDungeonItemLevel: 284,
        slotAware: true,
        bisListActive: false,
      }),
    ).toEqual({ kind: "ilvl", level: 2 });
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
      bis: emptyTrack,
      bisVariant: emptyTrack,
      ilvl: emptyTrack,
      equippedCount: 0,
      peakDungeonItemLevel: 284,
      slotAware: false,
      bisListActive: false,
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
      bis: emptyTrack,
      bisVariant: emptyTrack,
      ilvl: emptyTrack,
      equippedCount: 1,
      peakDungeonItemLevel: 264,
      slotAware: true,
      bisListActive: false,
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
    expect(iccHint.ilvl.upgradeSlotCount).toBeGreaterThan(0);
    expect(iccHint.ilvl.level).toBeGreaterThanOrEqual(2);

    const naxxHint = evaluateGearUpgradeHint(parsed.gearItems, {
      name: "Наксрамас",
      raidKey: "naxxramas",
      itemLevel: [213],
    });
    expect(naxxHint.ilvl.level).toBe(0);
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
    expect(rsHint.ilvl.upgradeSlots.some((slotHint) => slotHint.slot === 14)).toBe(
      false,
    );
    expect(rsHint.ilvl.upgradeSlots.some((slotHint) => slotHint.slot === 15)).toBe(
      false,
    );
    expect(rsHint.ilvl.upgradeSlotCount).toBeGreaterThan(0);
  });

  it("filters BiS track to BiS items while keeping ilvl track separate", () => {
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

    expect(rsHint.bisListActive).toBe(true);
    expect(rsHint.bis.upgradeSlotCount).toBe(0);
    expect(rsHint.ilvl.upgradeSlotCount).toBeGreaterThan(0);
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

    expect(rsHint.bisListActive).toBe(true);
    expect(rsHint.bis.upgradeSlotCount).toBe(1);
    expect(rsHint.bis.upgradeSlots[0]?.bestLootItemId).toBe(54581);
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

    expect(iccHint.bisListActive).toBe(true);
    expect(iccHint.bis.upgradeSlotCount).toBe(1);
    expect(iccHint.bis.upgradeSlots[0]?.bestLootItemId).toBe(50709);
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

    expect(iccHint.bisListActive).toBe(true);
    expect(iccHint.bis.upgradeSlotCount).toBe(0);
  });

  it("falls back to ilvl-only hints for custom dungeons without raid loot", () => {
    const hint = evaluateGearUpgradeHint([{ slot: 14, id: 50426 }], {
      name: "Custom dungeon",
      itemLevel: [300],
    });

    expect(hint.slotAware).toBe(false);
    expect(hint.ilvl.upgradeSlotCount).toBe(1);
  });

  it("resolves raid loot from the Russian dungeon name when raidKey is missing", () => {
    const dungeon = createTestDungeon({
      name: "Рубиновое святилище",
      itemLevel: [284],
      difficulty: DungeonDifficulty.HEROIC,
    });

    const hint = evaluateGearUpgradeHint([{ slot: 14, id: 50426 }], dungeon);
    expect(hint.slotAware).toBe(true);
    expect(hint.ilvl.upgradeSlotCount).toBe(0);
  });

  it("does not suggest crossbow ranged upgrades for priests", () => {
    const hint = evaluateGearUpgradeHint(
      [{ slot: 16, id: 50033 }],
      {
        name: "ICC25 HM",
        raidKey: "icecrownCitadel",
        itemLevel: [277, 284],
      },
      undefined,
      { className: ClassName.Priest, spec: "Shadow" },
    );

    const rangedHint = hint.ilvl.upgradeSlots.find((slotHint) => slotHint.slot === 16);
    expect(rangedHint?.bestLootItemId).not.toBe(49981);
    expect(rangedHint?.bestLootItemId).not.toBe(50733);
  });

  it("flags BiS heroic belt on ICC25H when equipped belt is 264", () => {
    const bisSlotMap = buildBisSlotMap(retributionPaladinBis.presets[0]);
    const equipContext = { className: ClassName.Paladin, spec: "Retribution" };

    const hint = evaluateGearUpgradeHint(
      [{ slot: 7, id: 50995 }],
      {
        name: "ICC25H",
        raidKey: "icecrownCitadel",
        itemLevel: [277, 284],
      },
      bisSlotMap,
      equipContext,
    );

    expect(hint.bis.upgradeSlotCount).toBe(1);
    expect(hint.bis.upgradeSlots[0]?.bestLootItemId).toBe(50707);
  });

  it("flags BiS normal belt variant on ICC25N when equipped belt is below tier", () => {
    const bisSlotMap = buildBisSlotMap(retributionPaladinBis.presets[0]);
    const equipContext = { className: ClassName.Paladin, spec: "Retribution" };

    const hint = evaluateGearUpgradeHint(
      [{ slot: 7, id: 50778 }],
      {
        name: "ICC25N",
        raidKey: "icecrownCitadel",
        itemLevel: [264],
      },
      bisSlotMap,
      equipContext,
    );

    expect(hint.bis.upgradeSlotCount).toBe(0);
    expect(hint.bisVariant.upgradeSlotCount).toBe(1);
    expect(hint.bisVariant.upgradeSlots[0]?.bestLootItemId).toBe(50067);
    expect(
      hint.ilvl.upgradeSlots.find((slotHint) => slotHint.slot === 7)?.bestLootItemId,
    ).not.toBe(50067);
  });

  it("does not flag belt when the normal BiS name variant is already equipped", () => {
    const bisSlotMap = buildBisSlotMap(retributionPaladinBis.presets[0]);
    const equipContext = { className: ClassName.Paladin, spec: "Retribution" };

    const hint = evaluateGearUpgradeHint(
      [{ slot: 7, id: 50067 }],
      {
        name: "ICC25N",
        raidKey: "icecrownCitadel",
        itemLevel: [264],
      },
      bisSlotMap,
      equipContext,
    );

    expect(hint.bis.upgradeSlotCount).toBe(0);
    expect(hint.bisVariant.upgradeSlotCount).toBe(0);
  });

  it("flags same-ilvl BiS normal variant when heroic id is on the list", () => {
    const bisSlotMap = buildBisSlotMap(retributionPaladinBis.presets[0]);
    const equipContext = { className: ClassName.Paladin, spec: "Retribution" };

    const hint = evaluateGearUpgradeHint(
      [{ slot: 7, id: 50995 }],
      {
        name: "ICC25N",
        raidKey: "icecrownCitadel",
        itemLevel: [264],
      },
      bisSlotMap,
      equipContext,
    );

    expect(hint.bis.upgradeSlotCount).toBe(0);
    expect(hint.bisVariant.upgradeSlotCount).toBe(1);
    expect(hint.bisVariant.upgradeSlots[0]?.bestLootItemId).toBe(50067);
  });

  it("excludes BiS loot from generic ilvl upgrade track", () => {
    const bisSlotMap = buildBisSlotMap(retributionPaladinBis.presets[0]);
    const equipContext = { className: ClassName.Paladin, spec: "Retribution" };

    const hint = evaluateGearUpgradeHint(
      [{ slot: 7, id: 50778 }],
      {
        name: "ICC25N",
        raidKey: "icecrownCitadel",
        itemLevel: [264],
      },
      bisSlotMap,
      equipContext,
    );

    expect(
      hint.ilvl.upgradeSlots.find((slotHint) => slotHint.slot === 7)?.bestLootItemId,
    ).not.toBe(50067);
  });
});

describe("formatGearUpgradeHintTooltip", () => {
  it("lists BiS, variant, and ilvl upgrade sections when all apply", () => {
    const tooltip = formatGearUpgradeHintTooltip(
      {
        bis: {
          level: 2,
          upgradeSlotCount: 1,
          upgradeSlots: [{ slot: 1, bestLootItemId: 54581, bestLootItemLevel: 284 }],
        },
        bisVariant: {
          level: 1,
          upgradeSlotCount: 1,
          upgradeSlots: [{ slot: 7, bestLootItemId: 50067, bestLootItemLevel: 264 }],
        },
        ilvl: {
          level: 2,
          upgradeSlotCount: 2,
          upgradeSlots: [
            { slot: 12, bestLootItemId: 54569, bestLootItemLevel: 284 },
          ],
        },
        equippedCount: 17,
        peakDungeonItemLevel: 284,
        slotAware: true,
        bisListActive: true,
      },
      "en",
      testTranslator,
    );

    expect(tooltip).toContain("1 BiS slot(s) missing targets");
    expect(tooltip).toContain("normal-variant upgrades");
    expect(tooltip).toContain("Up to 2 slot(s) may have higher-ilvl raid loot");
    expect(tooltip).toContain("spec-relevant stats");
    expect(tooltip).toContain("Neck");
    expect(tooltip).toContain("→");
  });

  it("uses amber for BiS and blue for ilvl toggle cell tints with stronger levels", () => {
    const theme = createAppTheme("light");

    const bisLow = getGearHintCellBackgroundColor({ kind: "bis", level: 1 }, theme);
    const bisHigh = getGearHintCellBackgroundColor({ kind: "bis", level: 3 }, theme);
    const ilvlLow = getGearHintCellBackgroundColor({ kind: "ilvl", level: 1 }, theme);
    const ilvlHigh = getGearHintCellBackgroundColor({ kind: "ilvl", level: 3 }, theme);

    expect(bisLow).toMatch(/^rgba\(.*\)$/);
    expect(bisHigh).toMatch(/^rgba\(.*\)$/);
    expect(ilvlLow).toMatch(/^rgba\(.*\)$/);
    expect(ilvlHigh).toMatch(/^rgba\(.*\)$/);
    expect(bisLow).not.toEqual(ilvlLow);
    expect(bisHigh).not.toEqual(ilvlHigh);
    expect(bisLow).not.toEqual(bisHigh);
    expect(ilvlLow).not.toEqual(ilvlHigh);
  });
});
