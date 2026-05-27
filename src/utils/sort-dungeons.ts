import {
  DungeonDifficulty,
  type DungeonDifficulty as DungeonDifficultyValue,
  type DungeonRecord,
} from "../types/dungeons.ts";
import { getStartingItemLevel } from "./item-level-tier.ts";

export type DungeonSortKey =
  | "name"
  | "size"
  | "difficulty"
  | "itemLevel"
  | "completions";

export type SortDirection = "asc" | "desc";

function difficultySortRank(difficulty: DungeonDifficultyValue): number {
  return difficulty === DungeonDifficulty.NORMAL ? 0 : 1;
}

export function defaultSortDirectionForKey(key: DungeonSortKey): SortDirection {
  return key === "itemLevel" || key === "completions" ? "desc" : "asc";
}

export function sortDungeons(
  list: DungeonRecord[],
  key: DungeonSortKey,
  direction: SortDirection,
  completionsByDungeonId?: Readonly<Record<string, number>>,
): DungeonRecord[] {
  const startingIlvlCache =
    key === "itemLevel" ? new Map<string, number>() : null;
  const getCachedStartingItemLevel = (dungeon: DungeonRecord): number => {
    if (!startingIlvlCache) return getStartingItemLevel(dungeon.itemLevel);
    const cached = startingIlvlCache.get(dungeon.id);
    if (cached !== undefined) return cached;
    const computed = getStartingItemLevel(dungeon.itemLevel);
    startingIlvlCache.set(dungeon.id, computed);
    return computed;
  };

  const sorted = [...list].sort((firstDungeon, secondDungeon) => {
    let comparison = 0;
    if (key === "name") {
      comparison =
        firstDungeon.name.localeCompare(secondDungeon.name) ||
        firstDungeon.size - secondDungeon.size;
    } else if (key === "size") {
      comparison =
        firstDungeon.size - secondDungeon.size ||
        firstDungeon.name.localeCompare(secondDungeon.name);
    } else if (key === "difficulty") {
      comparison =
        difficultySortRank(firstDungeon.difficulty) -
          difficultySortRank(secondDungeon.difficulty) ||
        firstDungeon.name.localeCompare(secondDungeon.name) ||
        firstDungeon.size - secondDungeon.size;
    } else if (key === "itemLevel") {
      comparison =
        getCachedStartingItemLevel(firstDungeon) -
          getCachedStartingItemLevel(secondDungeon) ||
        firstDungeon.name.localeCompare(secondDungeon.name);
    } else if (key === "completions") {
      const firstCount = completionsByDungeonId?.[firstDungeon.id] ?? 0;
      const secondCount = completionsByDungeonId?.[secondDungeon.id] ?? 0;
      comparison =
        firstCount - secondCount ||
        firstDungeon.name.localeCompare(secondDungeon.name) ||
        firstDungeon.size - secondDungeon.size;
    }
    return direction === "asc" ? comparison : -comparison;
  });
  return sorted;
}
