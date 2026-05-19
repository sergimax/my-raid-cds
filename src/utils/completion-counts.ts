import type { CharacterRecord } from "../types/characters.ts";
import type { DungeonRecord, DungeonToggles } from "../types/dungeons.ts";

export function countCompletedForCharacter(
  characterId: string,
  dungeons: DungeonRecord[],
  dungeonToggles: DungeonToggles,
): number {
  const togglesForCharacter = dungeonToggles[characterId] ?? {};
  return dungeons.filter((dungeon) => togglesForCharacter[dungeon.id]).length;
}

export function countCompletedForDungeon(
  dungeonId: string,
  characters: CharacterRecord[],
  dungeonToggles: DungeonToggles,
): number {
  return characters.filter(
    (character) => dungeonToggles[character.id]?.[dungeonId],
  ).length;
}
