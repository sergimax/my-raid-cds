import type { EmblemKey } from "../assets/emblems/emblem-icons.ts";
import type { CharacterRecord } from "../types/characters.ts";
import type { DungeonRecord, DungeonToggles } from "../types/dungeons.ts";

export type PersistedTrackerState = {
  characters: CharacterRecord[];
  dungeons: DungeonRecord[];
  dungeonToggles: DungeonToggles;
};

export type LoadRaidTrackerResult = {
  state: PersistedTrackerState;
  loadWarning: string | null;
};

export type StoredCharacterSpecGear = {
  spec: string;
  gearScore?: number;
};

export type StoredCharacterGearItem = {
  slot: number;
  id: number;
  enchant?: number;
  gems?: number[];
};

export type StoredCharacter = {
  id: string;
  name: string;
  className: string;
  mainSpec?: StoredCharacterSpecGear | string;
  offSpec?: StoredCharacterSpecGear | string;
  /** Legacy v2 flat gear score — migrated to main spec on load. */
  gearScore?: number;
  gearItems?: StoredCharacterGearItem[];
};

export type StoredDungeon = {
  id: string;
  name: string;
  shortName?: string;
  size: DungeonRecord["size"];
  itemLevel: number[];
  emblem?: EmblemKey;
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

export const EMPTY_STATE: PersistedTrackerState = {
  characters: [],
  dungeons: [],
  dungeonToggles: {},
};
