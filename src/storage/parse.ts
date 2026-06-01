import { EmblemKey, type EmblemKey as EmblemKeyType } from "../assets/emblems/emblem-icons.ts";
import { Classes, type CharacterRecord } from "../types/characters.ts";
import {
  DungeonDifficulty,
  DungeonSizes,
  type DungeonRecord,
  type DungeonToggles,
} from "../types/dungeons.ts";
import {
  CURRENT_SCHEMA_VERSION,
  LOAD_WARNING_CORRUPTED_SAVE,
  STORAGE_KEY,
} from "./constants.ts";
import {
  EMPTY_STATE,
  type LoadRaidTrackerResult,
  type StoredCharacter,
  type StoredDungeon,
  type StoredPayload,
} from "./types.ts";

const VALID_EMBLEM_KEYS = new Set<string>(Object.values(EmblemKey));

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseStoredEmblem(stored: StoredDungeon): EmblemKeyType | undefined {
  if (typeof stored.emblem === "string" && VALID_EMBLEM_KEYS.has(stored.emblem)) {
    return stored.emblem as EmblemKeyType;
  }
  return undefined;
}

function readRawPayload(): { payload: StoredPayload | null; corrupted: boolean } {
  let raw: string | null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return { payload: null, corrupted: true };
  }

  if (!raw) {
    return { payload: null, corrupted: false };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { payload: null, corrupted: true };
  }

  if (!isRecord(parsed)) {
    return { payload: null, corrupted: true };
  }

  if (!Array.isArray(parsed.characters) || !isRecord(parsed.dungeonToggles)) {
    return { payload: null, corrupted: true };
  }

  const dungeons = Array.isArray(parsed.dungeons) ? parsed.dungeons : [];
  const schemaVersion =
    typeof parsed.schemaVersion === "number" ? parsed.schemaVersion : undefined;

  return {
    payload: {
      schemaVersion,
      characters: parsed.characters as StoredCharacter[],
      dungeons: dungeons as StoredDungeon[],
      dungeonToggles: parsed.dungeonToggles as Record<string, Record<string, boolean>>,
    },
    corrupted: false,
  };
}

/** Reserved for future shape changes; v1 is the first versioned save format. */
function migrateStoredPayload(payload: StoredPayload): StoredPayload {
  if (payload.schemaVersion === undefined || payload.schemaVersion < 1) {
    return { ...payload, schemaVersion: CURRENT_SCHEMA_VERSION };
  }
  return payload;
}

function toDungeonRecord(stored: StoredDungeon): DungeonRecord | null {
  if (typeof stored.id !== "string" || typeof stored.name !== "string") {
    return null;
  }

  const rawDifficulty = stored.difficulty ?? stored.mode;
  const difficulty =
    rawDifficulty === DungeonDifficulty.HEROIC
      ? DungeonDifficulty.HEROIC
      : DungeonDifficulty.NORMAL;
  const size = DungeonSizes.includes(stored.size) ? stored.size : 10;
  if (!Array.isArray(stored.itemLevel) || !stored.itemLevel.every(Number.isFinite)) {
    return null;
  }

  const emblem = parseStoredEmblem(stored);
  return {
    id: stored.id,
    name: stored.name,
    size,
    itemLevel: stored.itemLevel as number[],
    difficulty,
    ...(emblem ? { emblem } : {}),
  };
}

function parseCharacters(storedCharacters: StoredCharacter[]): CharacterRecord[] {
  return storedCharacters
    .map((stored) => {
      if (typeof stored.id !== "string" || typeof stored.name !== "string") {
        return null;
      }
      const charClass = Classes.find(
        (candidate) => candidate.name === stored.className,
      );
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

function parsePayload(payload: StoredPayload): LoadRaidTrackerResult["state"] {
  const migrated = migrateStoredPayload(payload);
  const characters = parseCharacters(migrated.characters);
  const dungeons = parseDungeons(migrated.dungeons);
  const dungeonIds = new Set(dungeons.map((dungeon) => dungeon.id));
  const dungeonToggles =
    dungeons.length > 0
      ? parseDungeonToggles(migrated.dungeonToggles, dungeonIds)
      : {};

  return { characters, dungeons, dungeonToggles };
}

export function loadRaidTrackerState(): LoadRaidTrackerResult {
  const { payload, corrupted } = readRawPayload();

  if (corrupted) {
    return {
      state: EMPTY_STATE,
      loadWarning: LOAD_WARNING_CORRUPTED_SAVE,
    };
  }

  if (!payload) {
    return { state: EMPTY_STATE, loadWarning: null };
  }

  return {
    state: parsePayload(payload),
    loadWarning: null,
  };
}
