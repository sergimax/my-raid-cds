import {
  DungeonDifficulty,
  DungeonSizes,
  type DungeonSize,
} from "../types/dungeons.ts";

export type ParsedDungeonSearchQuery = {
  nameQuery: string;
  size?: DungeonSize;
  difficulty?: typeof DungeonDifficulty.HEROIC;
};

const HEROIC_SUFFIX_PATTERN = /(хм|х|h)$/u;

function parseTrailingSize(value: string): { size?: DungeonSize; rest: string } {
  for (const size of [...DungeonSizes].sort((first, second) => second - first)) {
    const sizeLabel = String(size);
    if (value.endsWith(sizeLabel)) {
      return {
        size,
        rest: value.slice(0, -sizeLabel.length),
      };
    }
  }
  return { rest: value };
}

/**
 * Parse mixed dungeon search: raid name/short name, optional size, optional heroic suffix.
 * Examples: `ICC`, `ICC25`, `ICC25H`, `ЦЛК25хм`, `ICC 25 h` (spaces ignored).
 */
export function parseDungeonSearchQuery(rawQuery: string): ParsedDungeonSearchQuery {
  let query = rawQuery.trim().toLowerCase().replace(/\s+/g, "");
  if (query === "") {
    return { nameQuery: "" };
  }

  let difficulty: typeof DungeonDifficulty.HEROIC | undefined;
  const heroicMatch = query.match(HEROIC_SUFFIX_PATTERN);
  if (heroicMatch) {
    difficulty = DungeonDifficulty.HEROIC;
    query = query.slice(0, -heroicMatch[0].length);
  }

  const { size, rest } = parseTrailingSize(query);
  return { nameQuery: rest, size, difficulty };
}
