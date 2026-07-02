import type { DungeonRecord } from "../types/dungeons.ts";
import { getDungeonSearchNameCandidates } from "./resolve-dungeon-raid-key.ts";
import { parseDungeonSearchQuery } from "./parse-dungeon-search-query.ts";

function dungeonMatchesParsedSearch(
  dungeon: DungeonRecord,
  parsed: ReturnType<typeof parseDungeonSearchQuery>,
): boolean {
  if (parsed.size !== undefined && dungeon.size !== parsed.size) {
    return false;
  }
  if (
    parsed.difficulty !== undefined &&
    dungeon.difficulty !== parsed.difficulty
  ) {
    return false;
  }
  if (parsed.nameQuery === "") {
    return true;
  }
  return getDungeonSearchNameCandidates(dungeon).some((candidate) =>
    candidate.toLowerCase().includes(parsed.nameQuery),
  );
}

export function filterDungeonsByName(
  list: DungeonRecord[],
  query: string,
): DungeonRecord[] {
  const normalizedQuery = query.trim();
  if (normalizedQuery === "") return list;
  const parsed = parseDungeonSearchQuery(normalizedQuery);
  return list.filter((dungeon) => dungeonMatchesParsedSearch(dungeon, parsed));
}
