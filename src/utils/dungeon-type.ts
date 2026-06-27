import {
  DungeonDifficulty,
  type DungeonRecord,
} from "../types/dungeons.ts";
import type { AppLocale } from "../i18n/types.ts";

/**
 * WotLK table/export type label: size plus optional heroic suffix (`25H`, `25`, `10хм`, …).
 */
export function formatDungeonTypeLabel(
  dungeon: Pick<DungeonRecord, "size" | "difficulty">,
  locale: AppLocale = "en",
): string {
  const base = String(dungeon.size);
  if (dungeon.difficulty === DungeonDifficulty.NORMAL) {
    return base;
  }
  return locale === "ru" ? `${base}хм` : `${base}H`;
}

/**
 * Sort priority for dungeon type (ascending rank):
 * 20 → 40 → 5 → 10N → 10H → 25N → 25H.
 * Descending sort surfaces current-tier 25H/25 rows first.
 */
export function dungeonTypeSortRank(
  dungeon: Pick<DungeonRecord, "size" | "difficulty">,
): number {
  const isHeroic = dungeon.difficulty === DungeonDifficulty.HEROIC;

  if (dungeon.size === 25) {
    return isHeroic ? 6 : 5;
  }
  if (dungeon.size === 10) {
    return isHeroic ? 4 : 3;
  }
  if (dungeon.size === 5) {
    return 2;
  }
  if (dungeon.size === 40) {
    return 1;
  }
  if (dungeon.size === 20) {
    return 0;
  }

  // Unknown sizes: fall back to size, heroic after normal at the same size.
  return dungeon.size * 2 + (isHeroic ? 1 : 0);
}

export function compareDungeonType(
  firstDungeon: Pick<DungeonRecord, "size" | "difficulty" | "name">,
  secondDungeon: Pick<DungeonRecord, "size" | "difficulty" | "name">,
): number {
  return (
    dungeonTypeSortRank(firstDungeon) - dungeonTypeSortRank(secondDungeon) ||
    firstDungeon.name.localeCompare(secondDungeon.name)
  );
}
