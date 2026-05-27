import type { CharacterRecord } from "../../types/characters.ts";
import type { DungeonRecord, DungeonToggles } from "../../types/dungeons.ts";

export type RaidTrackerTableProps = {
  characters: CharacterRecord[];
  dungeons: DungeonRecord[];
  dungeonToggles: DungeonToggles;
  onDungeonToggle: (characterId: string, dungeonId: string) => void;
  onDeleteCharacter: (characterId: string) => void;
  onDeleteDungeon: (dungeonId: string) => void;
  onResetCharacterToggles: (characterId: string) => void;
};
