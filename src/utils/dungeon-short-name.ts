import { RaidNames } from "../data/raid-names.ts";
import type { Dungeon } from "../types/dungeons.ts";

export function defaultShortNameForDungeonName(name: string): string | undefined {
  for (const raid of Object.values(RaidNames)) {
    if (raid.ru === name) {
      return raid.shortRu;
    }
    if ("shortEn" in raid && raid.en === name) {
      return raid.shortEn;
    }
  }
  return undefined;
}

export function getDungeonDisplayName(
  dungeon: Pick<Dungeon, "name" | "shortName">,
  compact: boolean,
): string {
  if (compact && dungeon.shortName) {
    return dungeon.shortName;
  }
  return dungeon.name;
}
