import {
  AppFooter,
  CharacterForm,
  DungeonForm,
  DungeonTable,
} from "./components/index.ts";
import { useRaidTracker } from "./hooks/use-raid-tracker.ts";
import { ConfigProvider, Table, theme } from "antd";
import type { ColumnsType } from "antd/es/table";
import "./App.css";

type AntDesignExampleRow = {
  key: string;
  name: string;
  size: number;
  mode: string;
  completions: number;
  ilvl: number;
};

const ANT_DESIGN_EXAMPLE_COLUMNS: ColumnsType<AntDesignExampleRow> = [
  { title: "Size", dataIndex: "size", key: "size", width: 72 },
  { title: "Mode", dataIndex: "mode", key: "mode", width: 96 },
  {
    title: "Completions",
    dataIndex: "completions",
    key: "completions",
    width: 120,
  },
  { title: "ilvl", dataIndex: "ilvl", key: "ilvl", width: 72 },
  { title: "Dungeon", dataIndex: "name", key: "name" },
];

const ANT_DESIGN_EXAMPLE_DATA: AntDesignExampleRow[] = [
  {
    key: "1",
    name: "Цитадель Ледяной Короны",
    size: 25,
    mode: "Heroic",
    completions: 3,
    ilvl: 277,
  },
  {
    key: "2",
    name: "Рубиновое святилище",
    size: 10,
    mode: "Normal",
    completions: 0,
    ilvl: 258,
  },
  {
    key: "3",
    name: "Око Вечности",
    size: 10,
    mode: "Heroic",
    completions: 1,
    ilvl: 213,
  },
];

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
          <div className="dungeon-table-antd-example">
            <p className="dungeon-table-antd-example-caption">
              Ant Design <code>Table</code> (static example)
            </p>
            <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
              <Table<AntDesignExampleRow>
                size="small"
                pagination={false}
                columns={ANT_DESIGN_EXAMPLE_COLUMNS}
                dataSource={ANT_DESIGN_EXAMPLE_DATA}
              />
            </ConfigProvider>
          </div>
        </div>

      </main>
      <AppFooter />
    </>
  );
}

export default App;
