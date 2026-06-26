import type { SxProps, Theme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import type { CharacterGearItem } from "../types/character-gear.ts";
import { getWotlkItemLevel } from "../data/wotlk-item-levels.ts";
import {
  getItemLevelTier,
  getItemLevelTierColor,
} from "./item-level-tier.ts";

export type GearUpgradeHintLevel = 0 | 1 | 2 | 3;

export type GearUpgradeHint = {
  level: GearUpgradeHintLevel;
  upgradeSlotCount: number;
  equippedCount: number;
  peakDungeonItemLevel: number;
};

const GEAR_UPGRADE_HINT_ALPHAS: Record<GearUpgradeHintLevel, number> = {
  0: 0,
  1: 0.14,
  2: 0.24,
  3: 0.34,
};

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

/**
 * Naive upgrade hint: any equipped item below the dungeon peak ilvl counts as
 * upgradeable. Does not yet filter by slot type or raid loot tables.
 */
export function evaluateGearUpgradeHint(
  gearItems: readonly CharacterGearItem[] | undefined,
  dungeonItemLevels: readonly number[],
): GearUpgradeHint {
  const peakDungeonItemLevel = getDungeonPeakItemLevel(dungeonItemLevels);
  const equippedCount = gearItems?.length ?? 0;

  if (equippedCount === 0 || peakDungeonItemLevel === 0) {
    return {
      level: 0,
      upgradeSlotCount: 0,
      equippedCount,
      peakDungeonItemLevel,
    };
  }

  let upgradeSlotCount = 0;
  for (const item of gearItems) {
    const itemLevel = getWotlkItemLevel(item.id);
    if (itemLevel === undefined || itemLevel < peakDungeonItemLevel) {
      upgradeSlotCount += 1;
    }
  }

  const level = upgradeHintLevelFromRatio(upgradeSlotCount / equippedCount);

  return {
    level,
    upgradeSlotCount,
    equippedCount,
    peakDungeonItemLevel,
  };
}

export function formatGearUpgradeHintTooltip(hint: GearUpgradeHint): string {
  if (hint.level === 0) {
    return "";
  }
  return `${hint.upgradeSlotCount} of ${hint.equippedCount} items below ilvl ${hint.peakDungeonItemLevel}`;
}

export function gearUpgradeHintCellSx(
  hintLevel: GearUpgradeHintLevel,
  dungeonItemLevels: readonly number[],
): SxProps<Theme> {
  if (hintLevel === 0 || dungeonItemLevels.length === 0) {
    return {};
  }

  const dungeonTier = getItemLevelTier(dungeonItemLevels);

  return (theme) => ({
    backgroundColor: alpha(
      getItemLevelTierColor(dungeonTier, theme.palette.mode),
      GEAR_UPGRADE_HINT_ALPHAS[hintLevel],
    ),
  });
}
