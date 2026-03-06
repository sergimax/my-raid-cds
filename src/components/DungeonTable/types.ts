import type { CharacterRecord } from "../../types/characters.ts";
import type { DungeonRecord } from "../../types/dungeons.ts";

export type DungeonToggles = Record<string, Record<string, boolean>>;

export type DungeonTableProps = {
  dungeons: DungeonRecord[];
  characters: CharacterRecord[];
  dungeonToggles: DungeonToggles;
  onDungeonToggle: (characterId: string, dungeonId: string) => void;
  onDeleteDungeon: (dungeonId: string) => void;
  onResetCharacter: (characterId: string) => void;
  onDeleteCharacter: (id: string) => void;
};
