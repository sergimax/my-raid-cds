import type { DungeonRecord } from "../types/dungeons.ts";

export function filterDungeonsByName(
  list: DungeonRecord[],
  query: string,
): DungeonRecord[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (normalizedQuery === "") return list;
  return list.filter((dungeon) =>
    dungeon.name.toLowerCase().includes(normalizedQuery),
  );
}
