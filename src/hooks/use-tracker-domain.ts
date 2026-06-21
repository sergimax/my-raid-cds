import { useCallback, useEffect, useMemo, useState } from "react";
import { DungeonList } from "../data/dungeons.ts";
import { loadRaidTrackerState, saveRaidTrackerState } from "../storage/index.ts";
import type { CharacterRecord } from "../types/characters.ts";
import type { DungeonRecord, DungeonToggles } from "../types/dungeons.ts";
import {
  flipCooldown,
  hasAnyCooldownOn,
  removeCharacterFromToggles,
  removeDungeonFromToggles,
  resetCharacterToggles,
} from "../utils/dungeon-toggles.ts";
import { generateUUID } from "../uuid.ts";

/** Domain state: characters, dungeons, toggles, persistence, and mutations. */
export function useTrackerDomain() {
  const [initialLoad] = useState(loadRaidTrackerState);
  const [characters, setCharacters] = useState<CharacterRecord[]>(
    initialLoad.state.characters,
  );
  const [dungeons, setDungeons] = useState<DungeonRecord[]>(
    initialLoad.state.dungeons,
  );
  const [dungeonToggles, setDungeonToggles] = useState<DungeonToggles>(
    initialLoad.state.dungeonToggles,
  );
  const [storageError, setStorageError] = useState<string | null>(
    initialLoad.loadWarning,
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      saveRaidTrackerState(
        { characters, dungeons, dungeonToggles },
        (errorMessage) => {
          setStorageError(errorMessage);
        },
      );
    }, 400);
    return () => clearTimeout(timeout);
  }, [characters, dungeons, dungeonToggles]);

  const addCharacter = useCallback((character: CharacterRecord) => {
    setCharacters((previous) => [...previous, character]);
  }, []);

  const addDungeon = useCallback((dungeon: DungeonRecord) => {
    setDungeons((previous) => [...previous, dungeon]);
  }, []);

  const handleDungeonToggle = useCallback(
    (characterId: string, dungeonId: string) => {
      setDungeonToggles((previous) =>
        flipCooldown(previous, characterId, dungeonId),
      );
    },
    [],
  );

  /** One-shot: fills the table from `DungeonList` only while it has no dungeons. */
  const handleAddFromTemplate = useCallback(() => {
    setDungeons((previousDungeons) => {
      if (previousDungeons.length > 0) {
        return previousDungeons;
      }
      return DungeonList.map((templateDungeon) => ({
        ...templateDungeon,
        id: generateUUID(),
      }));
    });
  }, []);

  const handleDeleteCharacter = useCallback((characterId: string) => {
    setCharacters((previous) =>
      previous.filter((character) => character.id !== characterId),
    );
    setDungeonToggles((previous) =>
      removeCharacterFromToggles(previous, characterId),
    );
  }, []);

  const handleDeleteDungeon = useCallback((dungeonId: string) => {
    setDungeons((previous) =>
      previous.filter((dungeon) => dungeon.id !== dungeonId),
    );
    setDungeonToggles((previous) =>
      removeDungeonFromToggles(previous, dungeonId),
    );
  }, []);

  const handleResetAllToggles = useCallback(() => {
    setDungeonToggles({});
  }, []);

  const handleResetCharacterToggles = useCallback((characterId: string) => {
    setDungeonToggles((previous) =>
      resetCharacterToggles(previous, characterId),
    );
  }, []);

  const canResetAllToggles = useMemo(
    () => hasAnyCooldownOn(dungeonToggles),
    [dungeonToggles],
  );

  return {
    characters,
    dungeons,
    dungeonToggles,
    storageError,
    addCharacter,
    addDungeon,
    handleDungeonToggle,
    handleDeleteCharacter,
    handleDeleteDungeon,
    handleAddFromTemplate,
    handleResetAllToggles,
    handleResetCharacterToggles,
    canResetAllToggles,
  };
}

export type TrackerDomainStore = ReturnType<typeof useTrackerDomain>;
