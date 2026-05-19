import {
  AppFooter,
  AppHeader,
  AppIntro,
  CharacterForm,
  CompletionSummary,
  DungeonForm,
  RaidTrackerTable,
  TrackerControls,
} from "./components/index.ts";
import "./App.css";
import { Alert, Container, Stack } from "@mui/material";
import { useMemo } from "react";
import type { CompletionSummaryData } from "./components/completion-summary/types.ts";
import { useRaidTracker } from "./hooks/use-raid-tracker.ts";

function App() {
  const tracker = useRaidTracker();

  const completionSummary = useMemo((): CompletionSummaryData => {
    const perCharacter = tracker.characters.map((character) => {
      const togglesForCharacter = tracker.dungeonToggles[character.id] ?? {};
      const completedCount = tracker.dungeons.filter(
        (dungeon) => togglesForCharacter[dungeon.id],
      ).length;
      return { character, completedCount };
    });

    const perDungeon = tracker.dungeons.map((dungeon) => {
      const completedCount = tracker.characters.filter(
        (character) => tracker.dungeonToggles[character.id]?.[dungeon.id],
      ).length;
      return { dungeon, completedCount };
    });

    const totalCells = tracker.characters.length * tracker.dungeons.length;
    const totalCompleted = perCharacter.reduce(
      (sum, row) => sum + row.completedCount,
      0,
    );

    return { perCharacter, perDungeon, totalCells, totalCompleted };
  }, [tracker.characters, tracker.dungeons, tracker.dungeonToggles]);

  const showIntro =
    tracker.characters.length === 0 && tracker.dungeons.length === 0;

  return (
    <div className="app-shell">
      <Container className="app-main" component="main" maxWidth="lg">
        <Stack spacing={2}>
          <AppHeader />
          <AppIntro visible={showIntro} />

          {tracker.storageError ? (
            <Alert severity="error">{tracker.storageError}</Alert>
          ) : null}

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

          <CompletionSummary
            summary={completionSummary}
            characterCount={tracker.characters.length}
            dungeonCount={tracker.dungeons.length}
          />

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
