import {
  AppFooter,
  AppHeader,
  AppIntro,
  CharacterForm,
  DungeonForm,
  RaidTrackerTable,
  ThemeModeToggle,
  TrackerControls,
} from "./components/index.ts";
import "./App.css";
import { Alert, Container, Stack } from "@mui/material";
import { useRaidTracker } from "./hooks/use-raid-tracker.ts";

function App() {
  const tracker = useRaidTracker();

  const showIntro =
    tracker.characters.length === 0 && tracker.dungeons.length === 0;

  return (
    <div className="app-shell">
      <Container
        className="app-main"
        component="main"
        maxWidth={false}
        disableGutters
      >
        <Stack spacing={2}>
          <AppHeader
            actions={
              <Stack
                direction="row"
                spacing={1}
                sx={{ alignItems: "center", flexWrap: "wrap" }}
              >
                <ThemeModeToggle />
                <TrackerControls
                showCharacterForm={tracker.showCharacterForm}
                showDungeonForm={tracker.showDungeonForm}
                onToggleCharacterForm={tracker.toggleCharacterForm}
                onToggleDungeonForm={tracker.toggleDungeonForm}
                onResetAllToggles={tracker.handleResetAllToggles}
                resetAllTogglesDisabled={!tracker.canResetAllToggles}
                showAddFromTemplate={tracker.dungeons.length === 0}
                onAddFromTemplate={tracker.handleAddFromTemplate}
              />
              </Stack>
            }
          />
          <AppIntro visible={showIntro} />

          {tracker.storageError ? (
            <Alert severity="error">{tracker.storageError}</Alert>
          ) : null}

          {tracker.showCharacterForm ? (
            <CharacterForm
              name={tracker.newCharacterName}
              characterClass={tracker.newCharacterClass}
              error={tracker.characterFormError}
              onNameChange={tracker.setNewCharacterName}
              onClassChange={tracker.setNewCharacterClass}
              onSubmit={tracker.handleCharacterFormSubmit}
            />
          ) : null}

          {tracker.showDungeonForm ? (
            <DungeonForm
              name={tracker.newDungeonName}
              size={tracker.newDungeonSize}
              itemLevelText={tracker.newDungeonItemLevelText}
              difficulty={tracker.newDungeonDifficulty}
              error={tracker.dungeonFormError}
              onNameChange={tracker.setNewDungeonName}
              onSizeChange={tracker.setNewDungeonSize}
              onItemLevelTextChange={tracker.setNewDungeonItemLevelText}
              onDifficultyChange={tracker.setNewDungeonDifficulty}
              onSubmit={tracker.handleDungeonFormSubmit}
            />
          ) : null}

          <RaidTrackerTable
            characters={tracker.characters}
            dungeons={tracker.dungeons}
            dungeonToggles={tracker.dungeonToggles}
            onDungeonToggle={tracker.handleDungeonToggle}
            onDeleteCharacter={tracker.handleDeleteCharacter}
            onDeleteDungeon={tracker.handleDeleteDungeon}
            onResetCharacterToggles={tracker.handleResetCharacterToggles}
          />
        </Stack>
      </Container>

      <AppFooter />
    </div>
  );
}

export default App;
