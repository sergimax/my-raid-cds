import { useEffect, useState } from "react";
import { CharacterForm } from "./components/CharacterForm.tsx";
import { DungeonTable } from "./components/DungeonTable.tsx";
import { DungeonList } from "./data/dungeons.ts";
import {
  loadCharacters,
  loadDungeonToggles,
  saveToStorage,
} from "./storage.ts";
import { type CharacterRecord, type CharacterClass } from "./types/characters.ts";
import "./App.css";

type DungeonToggles = Record<string, Record<number, boolean>>;

function App() {
  const [characterName, setCharacterName] = useState("");
  const [characterClass, setCharacterClass] = useState<CharacterClass | "">("");
  const [characters, setCharacters] = useState<CharacterRecord[]>(loadCharacters);
  const [dungeonToggles, setDungeonToggles] =
    useState<DungeonToggles>(loadDungeonToggles);

  useEffect(() => {
    saveToStorage(characters, dungeonToggles);
  }, [characters, dungeonToggles]);

  const handleAddCharacter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!characterName.trim() || !characterClass) return;
    const newCharacter: CharacterRecord = {
      id: crypto.randomUUID(),
      name: characterName.trim(),
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

  const handleDungeonToggle = (characterId: string, dungeonIndex: number) => {
    setDungeonToggles((prev) => ({
      ...prev,
      [characterId]: {
        ...prev[characterId],
        [dungeonIndex]: !(prev[characterId]?.[dungeonIndex] ?? false),
      },
    }));
  };

  const handleResetCharacter = (characterId: string) => {
    setDungeonToggles((prev) => ({
      ...prev,
      [characterId]: {},
    }));
  };

  return (
    <>
      <header>
        <h1>My Raid CDs</h1>
      </header>
      <CharacterForm
        characterName={characterName}
        setCharacterName={setCharacterName}
        characterClass={characterClass}
        setCharacterClass={setCharacterClass}
        onSubmit={handleAddCharacter}
      />
      <DungeonTable
        dungeons={DungeonList}
        characters={characters}
        dungeonToggles={dungeonToggles}
        onDungeonToggle={handleDungeonToggle}
        onResetCharacter={handleResetCharacter}
        onDeleteCharacter={handleDeleteCharacter}
      />
    </>
  );
}

export default App
