import {
  AppFooter,
  CharacterForm,
  DungeonForm,
  DungeonTable,
} from "./components/index.ts";
import { useRaidTracker } from "./hooks/use-raid-tracker.ts";
import "./App.css";
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";

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
    handleAddFromTemplate,
    handleDeleteDungeon,
    handleResetDungeons,
    handleResetCharacter,
    canResetDungeons,
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
            className={`reset-dungeons-btn ${!canResetDungeons ? "reset-btn--inactive" : ""}`}
            onClick={handleResetDungeons}
            disabled={!canResetDungeons}
            aria-label="Reset all cooldown toggles"
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

<div>
  MUI TEST
  <div className="mui-test">
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Age</TableCell>
            <TableCell>City</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>John</TableCell>
            <TableCell>20</TableCell>
            <TableCell>New York</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </div>
</div>

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
            {showForms && (
              <DungeonForm onSubmit={handleAddDungeon} existingDungeons={dungeons} />
            )}
          </div>
          <div className="dungeon-table-wrapper">
            <DungeonTable
              dungeons={dungeons}
              characters={characters}
              dungeonToggles={dungeonToggles}
              onDungeonToggle={handleDungeonToggle}
              onDeleteDungeon={handleDeleteDungeon}
              onAddFromTemplate={handleAddFromTemplate}
              onResetCharacter={handleResetCharacter}
              onDeleteCharacter={handleDeleteCharacter}
            />
          </div>
        </div>
      </main>
      <AppFooter />
    </>
  );
}

export default App;
