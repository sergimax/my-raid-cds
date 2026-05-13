import type { CharacterRecord } from "./characters.ts";
import type { DungeonRecord, DungeonToggles } from "./dungeons.ts";

export type DungeonSortKey =
  | "name"
  | "size"
  | "mode"
  | "itemLevel"
  | "completions";

export type DungeonTableProps = {
  dungeons: DungeonRecord[];
  characters: CharacterRecord[];
  dungeonToggles: DungeonToggles;
  onDungeonToggle: (characterId: string, dungeonId: string) => void;
  onDeleteDungeon: (dungeonId: string) => void;
  onAddFromTemplate?: () => void;
  onResetCharacter: (characterId: string) => void;
  onDeleteCharacter: (id: string) => void;
};

/** Same props contract as the removed HTML dungeon table. */
export type AntdExampleTableProps = DungeonTableProps;
