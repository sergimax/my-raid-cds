import { useEffect, useState } from "react";
import {
  CharacterForm,
  DungeonForm,
  DungeonTable,
} from "./components/index.ts";
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
  const [characterError, setCharacterError] = useState("");
  const [showForms, setShowForms] = useState(false);
  const [characters, setCharacters] = useState<CharacterRecord[]>(loadCharacters);
  const [dungeons, setDungeons] = useState<DungeonRecord[]>(loadDungeons);
  const [dungeonToggles, setDungeonToggles] =
    useState<DungeonToggles>(loadDungeonToggles);

  useEffect(() => {
    const timeout = setTimeout(() => {
      saveToStorage(characters, dungeons, dungeonToggles);
    }, 400);
    return () => clearTimeout(timeout);
  }, [characters, dungeons, dungeonToggles]);

  const clearCharacterError = () => setCharacterError("");

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

  return (
    <>
      <header className="app-header">
        <h1>My Raid CDs</h1>
        <div className="app-header-actions">

          <button
            type="button"
            className="form-toggle-btn"
            onClick={() => setShowForms((v) => !v)}
            aria-expanded={showForms}
          >
            {showForms ? "Hide forms" : "Add new"}
          </button>
          <button
            type="button"
            className="reset-dungeons-btn"
            onClick={handleResetDungeons}
            aria-label="Reset dungeons to default list"
          >
            Reset dungeons
          </button>
        </div>
      </header>
      <main>
        <section className="character-section">
          {characters.length === 0 && (
            <p className="empty-state" role="status">
              Add a character to get started
            </p>
          )}
          {showForms && (
            <CharacterForm
              characterName={characterName}
              setCharacterName={(v) => {
                setCharacterName(v);
                clearCharacterError();
              }}
              characterClass={characterClass}
              setCharacterClass={(v) => {
                setCharacterClass(v);
                clearCharacterError();
              }}
              onSubmit={handleAddCharacter}
              duplicateError={characterError}
            />
          )}
        </section>
        <div className="dungeon-section">
          <div className="dungeon-section-header">
            {showForms && <DungeonForm onSubmit={handleAddDungeon} />}
          </div>
        <div className="dungeon-table-wrapper">
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
      </div>
      </main>
    </>
  );
}

export default App
