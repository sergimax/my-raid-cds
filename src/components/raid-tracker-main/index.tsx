import { Alert, Stack } from "@mui/material";
import { useRaidTrackerContext } from "../../hooks/use-raid-tracker-context.ts";
import { AppIntro } from "../app-intro/index.tsx";
import { CharacterForm } from "../character-form/index.tsx";
import { DungeonForm } from "../dungeon-form/index.tsx";
import { RaidTrackerTable } from "../raid-tracker-table/index.tsx";

export function RaidTrackerMain() {
  const tracker = useRaidTrackerContext();
  const showIntro =
    tracker.characters.length === 0 && tracker.dungeons.length === 0;

  return (
    <Stack spacing={2}>
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
          onCancel={tracker.closeCharacterForm}
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
          onCancel={tracker.closeDungeonForm}
          onSubmit={tracker.handleDungeonFormSubmit}
        />
      ) : null}

      <RaidTrackerTable />
    </Stack>
  );
}
