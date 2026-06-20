import type { CharacterRecord } from "../../types/characters.ts";
import type { DungeonRecord, DungeonToggles } from "../../types/dungeons.ts";

export type ImportPanelProps = {
  characters: CharacterRecord[];
  visibleDungeons: DungeonRecord[];
  dungeonToggles: DungeonToggles;
  onClose: () => void;
};
