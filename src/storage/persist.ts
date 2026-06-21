import {
  CURRENT_SCHEMA_VERSION,
  STORAGE_KEY,
} from "./constants.ts";
import type { PersistedTrackerState, StoredCharacter, StoredDungeon, StoredPayload } from "./types.ts";

export function saveRaidTrackerState(
  state: PersistedTrackerState,
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
    ...(dungeon.shortName ? { shortName: dungeon.shortName } : {}),
    ...(dungeon.emblem ? { emblem: dungeon.emblem } : {}),
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

  const payload: StoredPayload = {
    schemaVersion: CURRENT_SCHEMA_VERSION,
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
