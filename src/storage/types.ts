import type { CharacterRecord } from "../types/characters.ts";
import type { DungeonRecord, DungeonToggles } from "../types/dungeons.ts";

export type RaidTrackerState = {
  characters: CharacterRecord[];
  dungeons: DungeonRecord[];
  dungeonToggles: DungeonToggles;
};

export type LoadRaidTrackerResult = {
  state: RaidTrackerState;
  loadWarning: string | null;
};

export type StoredCharacter = {
  id: string;
  name: string;
  className: string;
};

export type StoredDungeon = {
  id: string;
  name: string;
  size: DungeonRecord["size"];
  itemLevel: number[];
  emblem?: string;
  /** Legacy key from older saves */
  mode?: string;
  difficulty?: string;
};

export type StoredPayload = {
  schemaVersion?: number;
  characters: StoredCharacter[];
  dungeons: StoredDungeon[];
  dungeonToggles: Record<string, Record<string, boolean>>;
};

export const EMPTY_STATE: RaidTrackerState = {
  characters: [],
  dungeons: [],
  dungeonToggles: {},
};
