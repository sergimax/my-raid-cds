import type { CharacterRecord } from "../types/characters.ts";
import type { DungeonRecord, DungeonToggles } from "../types/dungeons.ts";
import { isCooldownOn } from "./dungeon-toggles.ts";

export function countCompletedForCharacter(
  characterId: string,
  dungeons: DungeonRecord[],
  dungeonToggles: DungeonToggles,
): number {
  return dungeons.filter((dungeon) =>
    isCooldownOn(dungeonToggles, characterId, dungeon.id),
  ).length;
}

export function countCompletedForDungeon(
  dungeonId: string,
  characters: CharacterRecord[],
  dungeonToggles: DungeonToggles,
): number {
  return characters.filter((character) =>
    isCooldownOn(dungeonToggles, character.id, dungeonId),
  ).length;
}
