import { useEffect, useState } from "react";
import { DungeonList } from "../data/dungeons.ts";
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

  const setCharacterNameWithClear = (v: string) => {
    setCharacterName(v);
    setCharacterError("");
  };

  const setCharacterClassWithClear = (v: CharacterClass | "") => {
    setCharacterClass(v);
    setCharacterError("");
  };

  const handleAddCharacter = (e: React.FormEvent) => {
    e.preventDefault();
    setCharacterError("");
    if (!characterName.trim() || !characterClass) return;
    const trimmedName = characterName.trim();
    const isDuplicate = characters.some(
      (c) =>
        c.name.toLowerCase() === trimmedName.toLowerCase() &&
        c.class?.name === characterClass.name
    );
    if (isDuplicate) {
      setCharacterError("A character with this name and class already exists.");
      return;
    }
    const newCharacter: CharacterRecord = {
      id: crypto.randomUUID(),
      name: trimmedName,
      class: characterClass,
    };
    setCharacters((prev) => [...prev, newCharacter]);
    setCharacterName("");
    setCharacterClass("");
  };

  const handleDeleteCharacter = (id: string) => {
    setCharacters((prev) => prev.filter((c) => c.id !== id));
    setDungeonToggles((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleDungeonToggle = (characterId: string, dungeonId: string) => {
    setDungeonToggles((prev) => ({
      ...prev,
      [characterId]: {
        ...(prev[characterId] ?? {}),
        [dungeonId]: !(prev[characterId]?.[dungeonId] ?? false),
      },
    }));
  };

  const handleAddDungeon = (dungeon: Omit<DungeonRecord, "id">) => {
    setDungeons((prev) => [
      ...prev,
      { ...dungeon, id: crypto.randomUUID() },
    ]);
  };

  const handleDeleteDungeon = (dungeonId: string) => {
    setDungeons((prev) => prev.filter((d) => d.id !== dungeonId));
    setDungeonToggles((prev) => {
      const next = { ...prev };
      for (const charId of Object.keys(next)) {
        const toggles = { ...next[charId] };
        delete toggles[dungeonId];
        next[charId] = toggles;
      }
      return next;
    });
  };

  const handleResetDungeons = () => {
    setDungeons(
      DungeonList.map((d) => ({ ...d, id: crypto.randomUUID() }))
    );
    setDungeonToggles({});
  };

  const handleResetCharacter = (characterId: string) => {
    setDungeonToggles((prev) => ({
      ...prev,
      [characterId]: {},
    }));
  };

  const toggleShowForms = () => setShowForms((v) => !v);

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
    handleDeleteDungeon,
    handleResetDungeons,
    handleResetCharacter,
  };
}
