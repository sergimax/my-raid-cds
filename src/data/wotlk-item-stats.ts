import statsJson from "./wotlk-item-stats.json";
import type { ClassName as ClassNameType } from "../types/characters.ts";

/** Sparse WowSims stat index → value for bundled item ids. */
export type WotlkItemStatsSparse = Record<string, number>;

const statsByItemId = statsJson as Record<string, WotlkItemStatsSparse>;

export function getWotlkItemStats(itemId: number): WotlkItemStatsSparse | undefined {
  return statsByItemId[String(itemId)];
}

export function hasItemStat(
  stats: WotlkItemStatsSparse,
  statIndex: number,
): boolean {
  return (stats[String(statIndex)] ?? 0) > 0;
}

export function hasAnyItemStat(
  stats: WotlkItemStatsSparse,
  statIndices: readonly number[],
): boolean {
  return statIndices.some((statIndex) => hasItemStat(stats, statIndex));
}

export type ItemStatFitContext = {
  className?: ClassNameType;
  spec?: string;
};
