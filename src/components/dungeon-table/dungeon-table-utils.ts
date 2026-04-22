import { formatRaidNameRuWithEn } from "../../data/dungeons";
import type { DungeonRecord } from "../../types/dungeons";

export type DungeonSortKey = "name" | "size" | "itemLevel" | "completions";

/** GearScore-style ilvl tiers (thresholds descending; tier 1 = below 200). */
const ILVL_TIER_THRESHOLDS = [
  277, 264, 258, 251, 245, 232, 226, 219, 213, 200,
] as const;

function getMaxItemLevel(dungeon: DungeonRecord): number {
  return dungeon.itemLevel.length > 0 ? Math.max(...dungeon.itemLevel) : 0;
}

export function getItemLevelTier(itemLevel: number[]): number {
  if (itemLevel.length === 0) return 1;
  const max = Math.max(...itemLevel);
  const i = ILVL_TIER_THRESHOLDS.findIndex((t) => max >= t);
  return i === -1 ? 1 : ILVL_TIER_THRESHOLDS.length + 1 - i;
}

export function filterDungeonsByName(
  list: DungeonRecord[],
  query: string
): DungeonRecord[] {
  const q = query.trim().toLowerCase();
  if (q === "") return list;
  return list.filter((dungeon) => dungeon.name.toLowerCase().includes(q));
}

export function sortDungeons(
  list: DungeonRecord[],
  key: DungeonSortKey,
  dir: "asc" | "desc",
  completionsByDungeonId?: Readonly<Record<string, number>>
): DungeonRecord[] {
  const maxIlvlCache = key === "itemLevel" ? new Map<string, number>() : null;
  const getCachedMaxItemLevel = (dungeon: DungeonRecord): number => {
    if (!maxIlvlCache) return getMaxItemLevel(dungeon);
    const existing = maxIlvlCache.get(dungeon.id);
    if (existing !== undefined) return existing;
    const computed = getMaxItemLevel(dungeon);
    maxIlvlCache.set(dungeon.id, computed);
    return computed;
  };

  const sorted = [...list].sort((firstDungeon, secondDungeon) => {
    let cmp = 0;
    if (key === "name") {
      cmp =
        firstDungeon.name.localeCompare(secondDungeon.name) ||
        firstDungeon.size - secondDungeon.size;
    } else if (key === "size") {
      cmp =
        firstDungeon.size - secondDungeon.size ||
        firstDungeon.name.localeCompare(secondDungeon.name);
    } else if (key === "itemLevel") {
      cmp =
        getCachedMaxItemLevel(firstDungeon) -
          getCachedMaxItemLevel(secondDungeon) ||
        firstDungeon.name.localeCompare(secondDungeon.name);
    } else if (key === "completions") {
      const a = completionsByDungeonId?.[firstDungeon.id] ?? 0;
      const b = completionsByDungeonId?.[secondDungeon.id] ?? 0;
      cmp =
        a - b ||
        firstDungeon.name.localeCompare(secondDungeon.name) ||
        firstDungeon.size - secondDungeon.size;
    }
    return dir === "asc" ? cmp : -cmp;
  });
  return sorted;
}

export function dungeonCellTitle(
  dungeon: DungeonRecord,
  completionCount: number
): string {
  const name = formatRaidNameRuWithEn(dungeon.name);
  const completionText = `${completionCount} completions`;
  return dungeon.itemLevel.length > 0
    ? `${name} — ${completionText} — Item level: ${dungeon.itemLevel.join(", ")}`
    : `${name} — ${completionText} — Item level not set`;
}

export function characterHasToggles(
  toggles: Record<string, boolean> | undefined
): boolean {
  return toggles ? Object.values(toggles).some(Boolean) : false;
}
