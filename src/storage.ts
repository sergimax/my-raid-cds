import { DungeonList } from "./data/dungeons.ts";
import { Classes, type CharacterRecord } from "./types/characters.ts";
import { DungeonSizes, type DungeonRecord } from "./types/dungeons.ts";

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
  mode: string;
};

type StoredData = {
  characters: StoredCharacter[];
  dungeons: StoredDungeon[];
  dungeonToggles: Record<string, Record<string, boolean>>;
};

function loadStoredData(): StoredData | null {
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
    return { ...parsed, dungeons } as StoredData;
  } catch {
    return null;
  }
}

function toDungeonRecord(stored: StoredDungeon): DungeonRecord | null {
  const mode = stored.mode === "Heroic" ? "Heroic" : "Normal";
  const size = DungeonSizes.includes(stored.size) ? stored.size : 10;
  if (!Array.isArray(stored.itemLevel) || !stored.itemLevel.every(Number.isFinite)) {
    return null;
  }
  return {
    id: stored.id,
    name: stored.name,
    size,
    itemLevel: stored.itemLevel as number[],
    mode,
  };
}

export function loadCharacters(): CharacterRecord[] {
  const data = loadStoredData();
  if (!data?.characters?.length) return [];

  return data.characters
    .map((stored) => {
      const charClass = Classes.find((c) => c.name === stored.className);
      if (!charClass) return null;
      return {
        id: stored.id,
        name: stored.name,
        class: charClass,
      } as CharacterRecord;
    })
    .filter((c): c is CharacterRecord => c !== null);
}

export function loadDungeons(): DungeonRecord[] {
  const data = loadStoredData();
  if (!data?.dungeons?.length) {
    return DungeonList.map((d) => ({ ...d, id: crypto.randomUUID() }));
  }
  const result: DungeonRecord[] = [];
  for (const stored of data.dungeons) {
    const dungeon = toDungeonRecord(stored);
    if (dungeon) result.push(dungeon);
  }
  return result.length > 0 ? result : DungeonList.map((d) => ({ ...d, id: crypto.randomUUID() }));
}

export function loadDungeonToggles(): Record<string, Record<string, boolean>> {
  const data = loadStoredData();
  if (!data?.dungeonToggles) return {};
  if (!Array.isArray(data.dungeons) || data.dungeons.length === 0) {
    return {};
  }

  const result: Record<string, Record<string, boolean>> = {};
  const dungeonIds = new Set(data.dungeons.map((d) => d.id));
  for (const [charId, toggles] of Object.entries(data.dungeonToggles)) {
    if (toggles && typeof toggles === "object") {
      result[charId] = {};
      for (const [dungeonId, value] of Object.entries(toggles)) {
        if (dungeonIds.has(dungeonId) && typeof value === "boolean") {
          result[charId][dungeonId] = value;
        }
      }
    }
  }
  return result;
}

export function saveToStorage(
  characters: CharacterRecord[],
  dungeons: DungeonRecord[],
  dungeonToggles: Record<string, Record<string, boolean>>,
  onError?: (message: string | null) => void
): void {
  const characterIds = new Set(characters.map((c) => c.id));
  const dungeonIds = new Set(dungeons.map((d) => d.id));

  const storedCharacters: StoredCharacter[] = characters.map((c) => ({
    id: c.id,
    name: c.name,
    className: c.class?.name ?? "",
  }));

  const storedDungeons: StoredDungeon[] = dungeons.map((d) => ({
    id: d.id,
    name: d.name,
    size: d.size,
    itemLevel: d.itemLevel,
    mode: d.mode,
  }));

  const storedToggles: Record<string, Record<string, boolean>> = {};
  for (const [charId, toggles] of Object.entries(dungeonToggles)) {
    if (characterIds.has(charId) && toggles && Object.keys(toggles).length > 0) {
      const filtered: Record<string, boolean> = {};
      for (const [dungeonId, value] of Object.entries(toggles)) {
        if (dungeonIds.has(dungeonId)) filtered[dungeonId] = value;
      }
      if (Object.keys(filtered).length > 0) {
        storedToggles[charId] = filtered;
      }
    }
  }

  const data: StoredData = {
    characters: storedCharacters,
    dungeons: storedDungeons,
    dungeonToggles: storedToggles,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    onError?.(null);
  } catch (e) {
    const message =
      e instanceof DOMException && e.name === "QuotaExceededError"
        ? "Storage quota exceeded. Please free up space."
        : "Failed to save data. Please try again.";
    onError?.(message);
  }
}
