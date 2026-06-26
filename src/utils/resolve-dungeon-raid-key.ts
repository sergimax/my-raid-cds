import { RaidNames, type RaidKey } from "../data/raid-names.ts";
import { isRaidKey } from "../data/raid-zones.ts";
import type { DungeonRecord } from "../types/dungeons.ts";

function normalizeDungeonName(value: string): string {
  return value.trim().toLowerCase();
}

function raidNameCandidates(raid: (typeof RaidNames)[RaidKey]): string[] {
  const candidates: string[] = [raid.ru, raid.en, raid.shortRu];
  if ("shortEn" in raid && typeof raid.shortEn === "string") {
    candidates.push(raid.shortEn);
  }
  return candidates;
}

/** Resolve template raid metadata for a dungeon row (saved key or known name). */
export function resolveDungeonRaidKey(
  dungeon: Pick<DungeonRecord, "name" | "raidKey">,
): RaidKey | undefined {
  if (dungeon.raidKey && isRaidKey(dungeon.raidKey)) {
    return dungeon.raidKey;
  }

  const normalizedName = normalizeDungeonName(dungeon.name);
  for (const raidKey of Object.keys(RaidNames) as RaidKey[]) {
    const raid = RaidNames[raidKey];
    if (
      raidNameCandidates(raid).some(
        (candidate) => normalizeDungeonName(candidate) === normalizedName,
      )
    ) {
      return raidKey;
    }
  }

  return undefined;
}
