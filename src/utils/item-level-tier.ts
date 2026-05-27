/** GearScore-style ilvl tiers (thresholds descending; tier 1 = below 200). */
export const ILVL_TIER_THRESHOLDS = [
  277, 264, 258, 251, 245, 232, 226, 219, 213, 200,
] as const;

export const ILVL_TIER_COUNT = ILVL_TIER_THRESHOLDS.length + 1;

/** Lowest value in `itemLevel` (starting / entry ilvl); 0 if unset. */
export function getStartingItemLevel(itemLevels: number[]): number {
  if (itemLevels.length === 0) return 0;
  return Math.min(...itemLevels);
}

/** Tier 1 (grey) … 11 (red) from peak item level in the list or a single value. */
export function getItemLevelTier(itemLevel: number | number[]): number {
  const levels = Array.isArray(itemLevel) ? itemLevel : [itemLevel];
  if (levels.length === 0) return 1;
  const peak = Math.max(...levels);
  const thresholdIndex = ILVL_TIER_THRESHOLDS.findIndex((threshold) => peak >= threshold);
  return thresholdIndex === -1
    ? 1
    : ILVL_TIER_THRESHOLDS.length + 1 - thresholdIndex;
}

function tierClassName(tier: number, target: "ilvl" | "dungeon-name"): string {
  const clamped = Math.min(Math.max(tier, 1), ILVL_TIER_COUNT);
  return `raid-tracker-table__${target}--tier-${clamped}`;
}

export function itemLevelTierClassName(tier: number): string {
  return tierClassName(tier, "ilvl");
}

export function dungeonNameTierClassName(tier: number): string {
  return tierClassName(tier, "dungeon-name");
}
