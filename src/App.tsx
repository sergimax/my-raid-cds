import {
  CharacterForm,
  DungeonForm,
  DungeonTable,
} from "./components/index.ts";
import { useRaidTracker } from "./hooks/useRaidTracker.ts";
import "./App.css";

function App() {
  const {
    characterName,
    setCharacterName,
    characterClass,
    setCharacterClass,
    characterError,
    handleAddCharacter,
    showForms,
    toggleShowForms,
    characters,
    dungeons,
    dungeonToggles,
    storageError,
    handleDeleteCharacter,
    handleDungeonToggle,
    handleAddDungeon,
    handleDeleteDungeon,
    handleResetDungeons,
    handleResetCharacter,
  } = useRaidTracker();

  return (
    <>
      <header className="app-header">
        <h1>My Raid CDs</h1>
        <div className="app-header-actions">
          <button
            type="button"
            className="form-toggle-btn"
            onClick={toggleShowForms}
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
      {storageError && (
        <div className="storage-error" role="alert">
          {storageError}
        </div>
      )}
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
              setCharacterName={setCharacterName}
              characterClass={characterClass}
              setCharacterClass={setCharacterClass}
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

export default App;
