import { Classes, type CharacterRecord } from "../types/characters.ts";
import {
  DungeonDifficulty,
  type DungeonRecord,
  type DungeonToggles,
} from "../types/dungeons.ts";

let characterCounter = 0;
let dungeonCounter = 0;

export function createTestCharacter(
  overrides: Partial<CharacterRecord> = {},
): CharacterRecord {
  characterCounter += 1;
  return {
    id: overrides.id ?? `character-${characterCounter}`,
    name: overrides.name ?? `Char${characterCounter}`,
    class: overrides.class ?? Classes[0],
    ...overrides,
  };
}

export function createTestDungeon(
  overrides: Partial<DungeonRecord> = {},
): DungeonRecord {
  dungeonCounter += 1;
  return {
    id: overrides.id ?? `dungeon-${dungeonCounter}`,
    name: overrides.name ?? `Dungeon ${dungeonCounter}`,
    size: overrides.size ?? 25,
    itemLevel: overrides.itemLevel ?? [200],
    difficulty: overrides.difficulty ?? DungeonDifficulty.NORMAL,
    ...overrides,
  };
}

export function createTestToggles(
  entries: Array<{ characterId: string; dungeonId: string; on?: boolean }>,
): DungeonToggles {
  const toggles: DungeonToggles = {};
  for (const entry of entries) {
    const previousForCharacter = toggles[entry.characterId] ?? {};
    toggles[entry.characterId] = {
      ...previousForCharacter,
      [entry.dungeonId]: entry.on ?? true,
    };
  }
  return toggles;
}
