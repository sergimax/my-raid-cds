import type { SxProps, Theme } from "@mui/material/styles";

/** GearScore-style ilvl tiers (thresholds descending; tier 1 = below 200). */
export const ILVL_TIER_THRESHOLDS = [
  277, 264, 258, 251, 245, 232, 226, 219, 213, 200,
] as const;

export const ILVL_TIER_COUNT = ILVL_TIER_THRESHOLDS.length + 1;

/** Grey → green → cyan → blue → violet → orange → red (light mode). */
export const ILVL_TIER_COLORS_LIGHT = [
  "#64748b",
  "#15803d",
  "#16a34a",
  "#0891b2",
  "#0284c7",
  "#2563eb",
  "#4338ca",
  "#7c3aed",
  "#9333ea",
  "#c2410c",
  "#b91c1c",
] as const;

/** Same progression tuned for dark mode. */
export const ILVL_TIER_COLORS_DARK = [
  "#a1a1aa",
  "#4ade80",
  "#86efac",
  "#22d3ee",
  "#38bdf8",
  "#60a5fa",
  "#818cf8",
  "#a78bfa",
  "#c084fc",
  "#fb923c",
  "#f87171",
] as const;

function clampTier(tier: number): number {
  return Math.min(Math.max(tier, 1), ILVL_TIER_COUNT);
}

export function getItemLevelTierColor(
  tier: number,
  colorMode: "light" | "dark",
): string {
  const palette =
    colorMode === "dark" ? ILVL_TIER_COLORS_DARK : ILVL_TIER_COLORS_LIGHT;
  return palette[clampTier(tier) - 1];
}

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

export function itemLevelTierSx(tier: number): SxProps<Theme> {
  return (theme) => ({
    color: getItemLevelTierColor(tier, theme.palette.mode),
    fontVariantNumeric: "tabular-nums",
    fontWeight: 600,
  });
}

export function dungeonNameTierSx(tier: number): SxProps<Theme> {
  return (theme) => ({
    color: getItemLevelTierColor(tier, theme.palette.mode),
    fontWeight: 600,
    lineHeight: 1.3,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  });
}
