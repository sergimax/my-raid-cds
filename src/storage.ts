import { Classes, type CharacterRecord } from "./types/characters.ts";

const STORAGE_KEY = "my-raid-cds";

type StoredCharacter = {
  id: string;
  name: string;
  className: string;
};

type StoredData = {
  characters: StoredCharacter[];
  dungeonToggles: Record<string, Record<string, boolean>>;
};

function loadStoredData(): StoredData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const obj = parsed as Record<string, unknown>;
    if (
      !Array.isArray(obj.characters) ||
      typeof obj.dungeonToggles !== "object"
    ) {
      return null;
    }
    return parsed as StoredData;
  } catch {
    return null;
  }
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

export function loadDungeonToggles(): Record<string, Record<number, boolean>> {
  const data = loadStoredData();
  if (!data?.dungeonToggles) return {};

  const result: Record<string, Record<number, boolean>> = {};
  for (const [charId, toggles] of Object.entries(data.dungeonToggles)) {
    if (toggles && typeof toggles === "object") {
      result[charId] = {};
      for (const [idx, value] of Object.entries(toggles)) {
        const numIdx = Number(idx);
        if (!Number.isNaN(numIdx) && typeof value === "boolean") {
          result[charId][numIdx] = value;
        }
      }
    }
  }
  return result;
}

export function saveToStorage(
  characters: CharacterRecord[],
  dungeonToggles: Record<string, Record<number, boolean>>
): void {
  const characterIds = new Set(characters.map((c) => c.id));

  const storedCharacters: StoredCharacter[] = characters.map((c) => ({
    id: c.id,
    name: c.name,
    className: c.class?.name ?? "",
  }));

  const storedToggles: Record<string, Record<string, boolean>> = {};
  for (const [charId, toggles] of Object.entries(dungeonToggles)) {
    if (characterIds.has(charId) && toggles && Object.keys(toggles).length > 0) {
      storedToggles[charId] = Object.fromEntries(
        Object.entries(toggles).map(([k, v]) => [k, v])
      );
    }
  }

  const data: StoredData = {
    characters: storedCharacters,
    dungeonToggles: storedToggles,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage errors (quota exceeded, private mode, etc.)
  }
}
