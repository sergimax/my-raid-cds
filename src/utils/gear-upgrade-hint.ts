import type { SystemStyleObject } from "@mui/system";
import type { Theme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import { gearSlotLabel } from "../data/gear-slot-names.ts";
import { getRaidLootItemIdsForTier } from "../data/raid-loot.ts";
import { getWotlkItemLevel } from "../data/wotlk-item-levels.ts";
import { getWotlkItemName } from "../data/wotlk-item-names.ts";
import type { CharacterGearItem } from "../types/character-gear.ts";
import type { DungeonRecord } from "../types/dungeons.ts";
import type { BisSlotMap } from "./bis-lists.ts";
import {
  getItemLevelTier,
  getItemLevelTierColor,
} from "./item-level-tier.ts";
import { resolveDungeonRaidKey } from "./resolve-dungeon-raid-key.ts";

export type GearUpgradeHintLevel = 0 | 1 | 2 | 3;

export type GearUpgradeSlotHint = {
  slot: number;
  bestLootItemId?: number;
  bestLootItemLevel?: number;
};

export type GearUpgradeHint = {
  level: GearUpgradeHintLevel;
  upgradeSlotCount: number;
  equippedCount: number;
  peakDungeonItemLevel: number;
  slotAware: boolean;
  bisFiltered: boolean;
  upgradeSlots: GearUpgradeSlotHint[];
};

const GEAR_UPGRADE_HINT_ALPHAS: Record<GearUpgradeHintLevel, number> = {
  0: 0,
  1: 0.14,
  2: 0.24,
  3: 0.34,
};

const MAX_TOOLTIP_SLOT_LABELS = 4;

/** Peak ilvl offered by a dungeon row (highest tier drop). */
export function getDungeonPeakItemLevel(itemLevels: readonly number[]): number {
  if (itemLevels.length === 0) {
    return 0;
  }
  return Math.max(...itemLevels);
}

function upgradeHintLevelFromRatio(ratio: number): GearUpgradeHintLevel {
  if (ratio <= 0) {
    return 0;
  }
  if (ratio <= 0.25) {
    return 1;
  }
  if (ratio <= 0.5) {
    return 2;
  }
  return 3;
}

function isSlotUpgradeableNaive(
  itemLevel: number | undefined,
  peakDungeonItemLevel: number,
): boolean {
  return itemLevel === undefined || itemLevel < peakDungeonItemLevel;
}

function pickBestLootItemId(itemIds: readonly number[]): number | undefined {
  let bestItemId: number | undefined;
  let bestItemLevel = -1;

  for (const itemId of itemIds) {
    const itemLevel = getWotlkItemLevel(itemId);
    if (itemLevel !== undefined && itemLevel > bestItemLevel) {
      bestItemLevel = itemLevel;
      bestItemId = itemId;
    }
  }

  return bestItemId;
}

function pickBestLootItemLevel(itemIds: readonly number[]): number | undefined {
  const itemLevels = itemIds
    .map((itemId) => getWotlkItemLevel(itemId))
    .filter((itemLevel): itemLevel is number => itemLevel !== undefined);

  if (itemLevels.length === 0) {
    return undefined;
  }

  return Math.max(...itemLevels);
}

function isSlotUpgradeableWithLoot(
  item: CharacterGearItem,
  raidKey: NonNullable<ReturnType<typeof resolveDungeonRaidKey>>,
  dungeonItemLevels: readonly number[],
  bisItemIdsForSlot?: readonly number[],
): GearUpgradeSlotHint | null {
  const raidLootIds = getRaidLootItemIdsForTier(
    raidKey,
    item.slot,
    dungeonItemLevels,
  );

  const relevantLootIds =
    bisItemIdsForSlot !== undefined
      ? raidLootIds.filter((itemId) => bisItemIdsForSlot.includes(itemId))
      : raidLootIds;

  if (relevantLootIds.length === 0) {
    return null;
  }

  const bestLootItemLevel = pickBestLootItemLevel(relevantLootIds);
  if (bestLootItemLevel === undefined) {
    return null;
  }

  const itemLevel = getWotlkItemLevel(item.id);
  if (itemLevel !== undefined && itemLevel >= bestLootItemLevel) {
    return null;
  }

  return {
    slot: item.slot,
    bestLootItemId: pickBestLootItemId(relevantLootIds),
    bestLootItemLevel,
  };
}

function evaluateNaiveGearUpgradeHint(
  gearItems: readonly CharacterGearItem[],
  peakDungeonItemLevel: number,
): GearUpgradeHint {
  const upgradeSlots: GearUpgradeSlotHint[] = [];

  for (const item of gearItems) {
    const itemLevel = getWotlkItemLevel(item.id);
    if (isSlotUpgradeableNaive(itemLevel, peakDungeonItemLevel)) {
      upgradeSlots.push({ slot: item.slot, bestLootItemLevel: peakDungeonItemLevel });
    }
  }

  const level = upgradeHintLevelFromRatio(upgradeSlots.length / gearItems.length);

  return {
    level,
    upgradeSlotCount: upgradeSlots.length,
    equippedCount: gearItems.length,
    peakDungeonItemLevel,
    slotAware: false,
    bisFiltered: false,
    upgradeSlots,
  };
}

function evaluateSlotAwareGearUpgradeHint(
  gearItems: readonly CharacterGearItem[],
  dungeonItemLevels: readonly number[],
  peakDungeonItemLevel: number,
  raidKey: NonNullable<ReturnType<typeof resolveDungeonRaidKey>>,
  bisSlotMap?: BisSlotMap,
): GearUpgradeHint {
  const bisFiltered = bisSlotMap !== undefined && bisSlotMap.size > 0;
  const upgradeSlots: GearUpgradeSlotHint[] = [];

  for (const item of gearItems) {
    const bisItemIdsForSlot = bisFiltered
      ? bisSlotMap.get(item.slot)
      : undefined;
    if (bisFiltered && (!bisItemIdsForSlot || bisItemIdsForSlot.length === 0)) {
      continue;
    }

    const slotHint = isSlotUpgradeableWithLoot(
      item,
      raidKey,
      dungeonItemLevels,
      bisItemIdsForSlot,
    );
    if (slotHint) {
      upgradeSlots.push(slotHint);
    }
  }

  const level = upgradeHintLevelFromRatio(upgradeSlots.length / gearItems.length);

  return {
    level,
    upgradeSlotCount: upgradeSlots.length,
    equippedCount: gearItems.length,
    peakDungeonItemLevel,
    slotAware: true,
    bisFiltered,
    upgradeSlots,
  };
}

export function evaluateGearUpgradeHint(
  gearItems: readonly CharacterGearItem[] | undefined,
  dungeon: Pick<DungeonRecord, "name" | "raidKey" | "itemLevel">,
  bisSlotMap?: BisSlotMap,
): GearUpgradeHint {
  const dungeonItemLevels = dungeon.itemLevel;
  const peakDungeonItemLevel = getDungeonPeakItemLevel(dungeonItemLevels);
  const equippedCount = gearItems?.length ?? 0;

  if (equippedCount === 0 || peakDungeonItemLevel === 0 || !gearItems) {
    return {
      level: 0,
      upgradeSlotCount: 0,
      equippedCount,
      peakDungeonItemLevel,
      slotAware: false,
      bisFiltered: false,
      upgradeSlots: [],
    };
  }

  const raidKey = resolveDungeonRaidKey(dungeon);
  if (raidKey) {
    return evaluateSlotAwareGearUpgradeHint(
      gearItems,
      dungeonItemLevels,
      peakDungeonItemLevel,
      raidKey,
      bisSlotMap,
    );
  }

  return evaluateNaiveGearUpgradeHint(gearItems, peakDungeonItemLevel);
}

function formatUpgradeSlotLabel(slotHint: GearUpgradeSlotHint): string {
  const slotLabel = gearSlotLabel(slotHint.slot);
  if (slotHint.bestLootItemId !== undefined) {
    const itemName = getWotlkItemName(slotHint.bestLootItemId);
    if (itemName) {
      return `${slotLabel} → ${itemName}`;
    }
  }
  return slotLabel;
}

export function formatGearUpgradeHintTooltip(hint: GearUpgradeHint): string {
  if (hint.level === 0) {
    return "";
  }

  const slotLabels = hint.upgradeSlots.map(formatUpgradeSlotLabel);
  const visibleLabels = slotLabels.slice(0, MAX_TOOLTIP_SLOT_LABELS);
  const remainingCount = slotLabels.length - visibleLabels.length;
  const slotSummary =
    remainingCount > 0
      ? `${visibleLabels.join(", ")} +${remainingCount} more`
      : visibleLabels.join(", ");

  const intro = hint.bisFiltered
    ? `${hint.upgradeSlotCount} BiS slot(s) with upgrades`
    : hint.slotAware
      ? `${hint.upgradeSlotCount} slot(s) with raid loot upgrades`
      : `${hint.upgradeSlotCount} of ${hint.equippedCount} items below ilvl ${hint.peakDungeonItemLevel}`;

  return `${intro}: ${slotSummary}`;
}

export function gearUpgradeHintCellSx(
  hintLevel: GearUpgradeHintLevel,
  dungeonItemLevels: readonly number[],
): SystemStyleObject<Theme> | ((theme: Theme) => SystemStyleObject<Theme>) {
  if (hintLevel === 0 || dungeonItemLevels.length === 0) {
    return {};
  }

  const dungeonTier = getItemLevelTier([...dungeonItemLevels]);

  return (theme) => ({
    backgroundColor: alpha(
      getItemLevelTierColor(dungeonTier, theme.palette.mode),
      GEAR_UPGRADE_HINT_ALPHAS[hintLevel],
    ),
  });
}
