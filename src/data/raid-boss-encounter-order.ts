import { RaidBossNames } from "./raid-boss-names.ts";
import type { RaidKey } from "./raid-names.ts";

/**
 * In-raid boss order (WowSims / `RaidBossNames` English keys).
 * Used to sort gear-hint boss groups and Soft pick targets.
 */
export const RaidBossEncounterOrder: Partial<
  Record<RaidKey, readonly string[]>
> = {
  icecrownCitadel: [
    "Lord Marrowgar",
    "Lady Deathwhisper",
    "Icecrown Gunship Battle",
    "Deathbringer Saurfang",
    "Festergut",
    "Rotface",
    "Professor Putricide",
    "Blood Prince Council",
    "Blood-Queen Lana'thel",
    "Valithria Dreamwalker",
    "Sindragosa",
    "The Lich King",
  ],
  trialOfTheCrusader: [
    "The Beasts of Northrend",
    "Lord Jaraxxus",
    "Faction Champions",
    "The Twin Val'kyr",
    "Anub'arak",
  ],
};

function normalizeBossLabel(value: string): string {
  return value.trim().toLocaleLowerCase();
}

/**
 * Sort index within a raid's encounter order.
 * Known bosses: 0…n−1. Unknown / unordered: after known bosses (stable by name).
 * No order table for the raid: `Number.POSITIVE_INFINITY` (caller falls back to name).
 */
export function getBossEncounterSortIndex(
  raidKey: RaidKey | undefined,
  bossName: string,
): number {
  if (!raidKey || !bossName) {
    return Number.POSITIVE_INFINITY;
  }
  const order = RaidBossEncounterOrder[raidKey];
  if (!order) {
    return Number.POSITIVE_INFINITY;
  }

  const normalized = normalizeBossLabel(bossName);
  for (let index = 0; index < order.length; index += 1) {
    const englishName = order[index]!;
    if (normalizeBossLabel(englishName) === normalized) {
      return index;
    }
    const localized = RaidBossNames[englishName];
    if (
      localized &&
      (normalizeBossLabel(localized.en) === normalized ||
        normalizeBossLabel(localized.ru) === normalized)
    ) {
      return index;
    }
  }

  // Unknown bosses (trash, tribute chest, …) after the ordered progression.
  return order.length;
}

/** Compare two boss labels for a raid; falls back to localeCompare when unordered. */
export function compareBossNamesByEncounterOrder(
  raidKey: RaidKey | undefined,
  leftBossName: string,
  rightBossName: string,
  locale?: string,
): number {
  const leftIndex = getBossEncounterSortIndex(raidKey, leftBossName);
  const rightIndex = getBossEncounterSortIndex(raidKey, rightBossName);
  if (leftIndex !== rightIndex) {
    return leftIndex - rightIndex;
  }
  return leftBossName.localeCompare(rightBossName, locale);
}
