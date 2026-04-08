import type { FormEvent } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DungeonList } from "../data/dungeons.ts";
import { generateUUID } from "../uuid.ts";
import {
  loadCharacters,
  loadDungeons,
  loadDungeonToggles,
  saveToStorage,
} from "../storage.ts";
import {
  type CharacterRecord,
  type CharacterClass,
} from "../types/characters.ts";
import type { DungeonRecord, DungeonToggles } from "../types/dungeons.ts";

export function useRaidTracker() {
  const [characterName, setCharacterName] = useState("");
  const [characterClass, setCharacterClass] = useState<CharacterClass | "">("");
  const [characterError, setCharacterError] = useState("");
  const [storageError, setStorageError] = useState<string | null>(null);
  const [showForms, setShowForms] = useState(false);
  const [characters, setCharacters] = useState<CharacterRecord[]>(loadCharacters);
  const [dungeons, setDungeons] = useState<DungeonRecord[]>(loadDungeons);
  const [dungeonToggles, setDungeonToggles] =
    useState<DungeonToggles>(loadDungeonToggles);

  useEffect(() => {
    const timeout = setTimeout(() => {
      saveToStorage(characters, dungeons, dungeonToggles, (err) =>
        setStorageError(err)
      );
    }, 400);
    return () => clearTimeout(timeout);
  }, [characters, dungeons, dungeonToggles]);

  const setCharacterNameWithClear = useCallback((characterNameValue: string) => {
    setCharacterName(characterNameValue);
    setCharacterError("");
  }, []);

  const setCharacterClassWithClear = useCallback((characterClassValue: CharacterClass | "") => {
    setCharacterClass(characterClassValue);
    setCharacterError("");
  }, []);

  const handleAddCharacter = useCallback((event: FormEvent) => {
    event.preventDefault();
    setCharacterError("");
    if (!characterName.trim() || !characterClass) return;
    const trimmedName = characterName.trim();
    const isDuplicate = characters.some(
      (existingCharacter) =>
        existingCharacter.name.toLowerCase() === trimmedName.toLowerCase() &&
        existingCharacter.class?.name === characterClass.name
    );
    if (isDuplicate) {
      setCharacterError("A character with this name and class already exists.");
      return;
    }
    const newCharacter: CharacterRecord = {
      id: generateUUID(),
      name: trimmedName,
      class: characterClass,
    };
    setCharacters((prev) => [...prev, newCharacter]);
    setCharacterName("");
    setCharacterClass("");
  }, [characterClass, characterName, characters]);

  const handleDeleteCharacter = useCallback((id: string) => {
    setCharacters((previousCharacters) =>
      previousCharacters.filter((character) => character.id !== id)
    );
    setDungeonToggles((previousDungeonToggles) => {
      const nextDungeonTogglesByCharacterId = { ...previousDungeonToggles };
      delete nextDungeonTogglesByCharacterId[id];
      return nextDungeonTogglesByCharacterId;
    });
  }, []);

  const handleDungeonToggle = useCallback((characterId: string, dungeonId: string) => {
    setDungeonToggles((previousDungeonToggles) => {
      const previousCharacterToggles = previousDungeonToggles[characterId] ?? {};
      const nextToggleValue = !(previousCharacterToggles[dungeonId] ?? false);
      return {
        ...previousDungeonToggles,
        [characterId]: {
          ...previousCharacterToggles,
          [dungeonId]: nextToggleValue,
        },
      };
    });
  }, []);

  const handleAddDungeon = useCallback((dungeon: Omit<DungeonRecord, "id">) => {
    setDungeons((previousDungeons) => [
      ...previousDungeons,
      { ...dungeon, id: generateUUID() },
    ]);
  }, []);

  const handleAddFromTemplate = useCallback(() => {
    setDungeons((previousDungeons) => {
      const templateDungeons = DungeonList.map((templateDungeon) => ({
        ...templateDungeon,
        id: generateUUID(),
      }));
      return [...previousDungeons, ...templateDungeons];
    });
  }, []);

  const handleDeleteDungeon = useCallback((dungeonId: string) => {
    setDungeons((previousDungeons) =>
      previousDungeons.filter((dungeon) => dungeon.id !== dungeonId)
    );
    setDungeonToggles((previousDungeonToggles) => {
      const nextDungeonTogglesByCharacterId = { ...previousDungeonToggles };
      for (const characterId of Object.keys(nextDungeonTogglesByCharacterId)) {
        const nextTogglesByDungeonId = { ...nextDungeonTogglesByCharacterId[characterId] };
        delete nextTogglesByDungeonId[dungeonId];
        nextDungeonTogglesByCharacterId[characterId] = nextTogglesByDungeonId;
      }
      return nextDungeonTogglesByCharacterId;
    });
  }, []);

  const handleResetDungeons = useCallback(() => {
    setDungeonToggles({});
  }, []);

  const handleResetCharacter = useCallback((characterId: string) => {
    setDungeonToggles((prev) => ({
      ...prev,
      [characterId]: {},
    }));
  }, []);

  const canResetDungeons = useMemo(() => {
    for (const toggles of Object.values(dungeonToggles)) {
      for (const value of Object.values(toggles)) {
        if (value) return true;
      }
    }
    return false;
  }, [dungeonToggles]);

  const toggleShowForms = useCallback(
    () => setShowForms((previousShowForms) => !previousShowForms),
    []
  );

  return {
    // Character form state
    characterName,
    setCharacterName: setCharacterNameWithClear,
    characterClass,
    setCharacterClass: setCharacterClassWithClear,
    characterError,
    handleAddCharacter,

    // UI state
    showForms,
    toggleShowForms,

    // Data
    characters,
    dungeons,
    dungeonToggles,
    storageError,

    // Handlers
    handleDeleteCharacter,
    handleDungeonToggle,
    handleAddDungeon,
    handleAddFromTemplate,
    handleDeleteDungeon,
    handleResetDungeons,
    handleResetCharacter,
    canResetDungeons,
  };
}
