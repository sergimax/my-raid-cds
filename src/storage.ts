import { Classes, type CharacterRecord } from "./types/characters.ts";
import {
  DungeonDifficulty,
  DungeonSizes,
  type DungeonRecord,
  type DungeonToggles,
} from "./types/dungeons.ts";

const STORAGE_KEY = "my-raid-cds";

type StoredCharacter = {
  id: string;
  name: string;
  className: string;
};

type StoredDungeon = {
  id: string;
  name: string;
  size: DungeonRecord["size"];
  itemLevel: number[];
  /** Legacy key from older saves */
  mode?: string;
  difficulty?: string;
};

type StoredData = {
  characters: StoredCharacter[];
  dungeons: StoredDungeon[];
  dungeonToggles: Record<string, Record<string, boolean>>;
};

export type RaidTrackerState = {
  characters: CharacterRecord[];
  dungeons: DungeonRecord[];
  dungeonToggles: DungeonToggles;
};

const EMPTY_STATE: RaidTrackerState = {
  characters: [],
  dungeons: [],
  dungeonToggles: {},
};

function readRawStoredData(): StoredData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const obj = parsed as Record<string, unknown>;
    if (!Array.isArray(obj.characters) || typeof obj.dungeonToggles !== "object") {
      return null;
    }
    const dungeons = Array.isArray(obj.dungeons) ? obj.dungeons : [];
    return {
      characters: obj.characters as StoredCharacter[],
      dungeons: dungeons as StoredDungeon[],
      dungeonToggles: obj.dungeonToggles as Record<string, Record<string, boolean>>,
    };
  } catch {
    return null;
  }
}

function toDungeonRecord(stored: StoredDungeon): DungeonRecord | null {
  const rawDifficulty = stored.difficulty ?? stored.mode;
  const difficulty =
    rawDifficulty === DungeonDifficulty.HEROIC
      ? DungeonDifficulty.HEROIC
      : DungeonDifficulty.NORMAL;
  const size = DungeonSizes.includes(stored.size) ? stored.size : 10;
  if (!Array.isArray(stored.itemLevel) || !stored.itemLevel.every(Number.isFinite)) {
    return null;
  }
  return {
    id: stored.id,
    name: stored.name,
    size,
    itemLevel: stored.itemLevel as number[],
    difficulty,
  };
}

function parseCharacters(storedCharacters: StoredCharacter[]): CharacterRecord[] {
  return storedCharacters
    .map((stored) => {
      const charClass = Classes.find((candidate) => candidate.name === stored.className);
      if (!charClass) return null;
      return {
        id: stored.id,
        name: stored.name,
        class: charClass,
      } as CharacterRecord;
    })
    .filter((character): character is CharacterRecord => character !== null);
}

function parseDungeons(storedDungeons: StoredDungeon[]): DungeonRecord[] {
  const result: DungeonRecord[] = [];
  for (const stored of storedDungeons) {
    const dungeon = toDungeonRecord(stored);
    if (dungeon) result.push(dungeon);
  }
  return result;
}

function parseDungeonToggles(
  storedToggles: Record<string, Record<string, boolean>>,
  dungeonIds: Set<string>,
): DungeonToggles {
  const result: DungeonToggles = {};
  for (const [charId, toggles] of Object.entries(storedToggles)) {
    if (!toggles || typeof toggles !== "object") continue;
    result[charId] = {};
    for (const [dungeonId, value] of Object.entries(toggles)) {
      if (dungeonIds.has(dungeonId) && typeof value === "boolean") {
        result[charId][dungeonId] = value;
      }
    }
  }
  return result;
}

export function loadRaidTrackerState(): RaidTrackerState {
  const data = readRawStoredData();
  if (!data) return EMPTY_STATE;

  const characters = parseCharacters(data.characters);
  const dungeons = parseDungeons(data.dungeons);
  const dungeonIds = new Set(dungeons.map((dungeon) => dungeon.id));
  const dungeonToggles =
    dungeons.length > 0
      ? parseDungeonToggles(data.dungeonToggles, dungeonIds)
      : {};

  return { characters, dungeons, dungeonToggles };
}

export function saveRaidTrackerState(
  state: RaidTrackerState,
  onError?: (message: string | null) => void,
): void {
  const { characters, dungeons, dungeonToggles } = state;
  const characterIds = new Set(characters.map((character) => character.id));
  const dungeonIds = new Set(dungeons.map((dungeon) => dungeon.id));

  const storedCharacters: StoredCharacter[] = characters.map((character) => ({
    id: character.id,
    name: character.name,
    className: character.class?.name ?? "",
  }));

  const storedDungeons: StoredDungeon[] = dungeons.map((dungeon) => ({
    id: dungeon.id,
    name: dungeon.name,
    size: dungeon.size,
    itemLevel: dungeon.itemLevel,
    difficulty: dungeon.difficulty,
  }));

  const storedToggles: Record<string, Record<string, boolean>> = {};
  for (const [charId, toggles] of Object.entries(dungeonToggles)) {
    if (!characterIds.has(charId) || !toggles) continue;
    const filtered: Record<string, boolean> = {};
    for (const [dungeonId, value] of Object.entries(toggles)) {
      if (dungeonIds.has(dungeonId)) filtered[dungeonId] = value;
    }
    if (Object.keys(filtered).length > 0) {
      storedToggles[charId] = filtered;
    }
  }

  const payload: StoredData = {
    characters: storedCharacters,
    dungeons: storedDungeons,
    dungeonToggles: storedToggles,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    onError?.(null);
  } catch (error) {
    const message =
      error instanceof DOMException && error.name === "QuotaExceededError"
        ? "Storage quota exceeded. Please free up space."
        : "Failed to save data. Please try again.";
    onError?.(message);
  }
}
