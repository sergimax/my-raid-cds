import { useEffect, useState } from "react";
import { CharacterForm } from "./components/CharacterForm.tsx";
import { DungeonForm } from "./components/DungeonForm.tsx";
import { DungeonTable } from "./components/DungeonTable.tsx";
import { DungeonList } from "./data/dungeons.ts";
import {
  loadCharacters,
  loadDungeons,
  loadDungeonToggles,
  saveToStorage,
} from "./storage.ts";
import { type CharacterRecord, type CharacterClass } from "./types/characters.ts";
import type { DungeonRecord } from "./types/dungeons.ts";
import "./App.css";

type DungeonToggles = Record<string, Record<string, boolean>>;

function App() {
  const [characterName, setCharacterName] = useState("");
  const [characterClass, setCharacterClass] = useState<CharacterClass | "">("");
  const [characters, setCharacters] = useState<CharacterRecord[]>(loadCharacters);
  const [dungeons, setDungeons] = useState<DungeonRecord[]>(loadDungeons);
  const [dungeonToggles, setDungeonToggles] =
    useState<DungeonToggles>(loadDungeonToggles);

  useEffect(() => {
    saveToStorage(characters, dungeons, dungeonToggles);
  }, [characters, dungeons, dungeonToggles]);

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
      <div className="dungeon-section">
        <div className="dungeon-section-header">
          <DungeonForm onSubmit={handleAddDungeon} />
          <button
            type="button"
            className="reset-dungeons-btn"
            onClick={handleResetDungeons}
          >
            Reset dungeons
          </button>
        </div>
        <DungeonTable
          dungeons={dungeons}
          characters={characters}
          dungeonToggles={dungeonToggles}
          onDungeonToggle={handleDungeonToggle}
          onDeleteDungeon={handleDeleteDungeon}
          onResetCharacter={handleResetCharacter}
          onDeleteCharacter={handleDeleteCharacter}
        />
      </div>
    </>
  );
}

export default App
