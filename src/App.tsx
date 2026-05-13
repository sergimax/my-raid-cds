import { AntdExampleTable, AppFooter } from "./components/index.ts";
import { useRaidTracker } from "./hooks/use-raid-tracker.ts";
import "./App.css";

function App() {
  const {
    characters,
    dungeons,
    dungeonToggles,
    storageError,
    handleDeleteCharacter,
    handleDungeonToggle,
    handleAddFromTemplate,
    handleDeleteDungeon,
    handleResetCharacter,
  } = useRaidTracker();

  return (
    <>
      <header className="app-header">
        <h1>My Raid CDs</h1>
      </header>
      {storageError && (
        <div className="storage-error" role="alert">
          {storageError}
        </div>
      )}
      <main>
        <section className="antd-section">
          <AntdExampleTable
            dungeons={dungeons}
            characters={characters}
            dungeonToggles={dungeonToggles}
            onDungeonToggle={handleDungeonToggle}
            onDeleteDungeon={handleDeleteDungeon}
            onAddFromTemplate={handleAddFromTemplate}
            onResetCharacter={handleResetCharacter}
            onDeleteCharacter={handleDeleteCharacter}
          />
        </section>
      </main>
      <AppFooter />
    </>
  );
}

export default App;
