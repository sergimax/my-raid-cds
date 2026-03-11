import type { CharacterRecord } from "../../types/characters.ts";
import type { DungeonRecord, DungeonToggles } from "../../types/dungeons.ts";

export type DungeonTableProps = {
  dungeons: DungeonRecord[];
  characters: CharacterRecord[];
  dungeonToggles: DungeonToggles;
  onDungeonToggle: (characterId: string, dungeonId: string) => void;
  onDeleteDungeon: (dungeonId: string) => void;
  onDeleteAllDungeons: () => void;
  onResetCharacter: (characterId: string) => void;
  onDeleteCharacter: (id: string) => void;
};
