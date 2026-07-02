import type { DungeonRecord } from "../types/dungeons.ts";
import { getDungeonSearchNameCandidates } from "./resolve-dungeon-raid-key.ts";

export function filterDungeonsByName(
  list: DungeonRecord[],
  query: string,
): DungeonRecord[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (normalizedQuery === "") return list;
  return list.filter((dungeon) =>
    getDungeonSearchNameCandidates(dungeon).some((candidate) =>
      candidate.toLowerCase().includes(normalizedQuery),
    ),
  );
}
