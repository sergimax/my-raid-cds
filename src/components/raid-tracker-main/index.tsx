import { Alert, Stack } from "@mui/material";
import { useRaidTrackerContext } from "../../hooks/use-raid-tracker-context.ts";
import type { TrackerFormsState } from "../../hooks/use-tracker-forms.ts";
import { AppIntro } from "../app-intro/index.tsx";
import { CharacterForm } from "../character-form/index.tsx";
import { DungeonForm } from "../dungeon-form/index.tsx";
import { RaidTrackerTable } from "../raid-tracker-table/index.tsx";

type RaidTrackerMainProps = {
  forms: TrackerFormsState;
  showImportPanel: boolean;
  closeImportPanel: () => void;
};

export function RaidTrackerMain({
  forms,
  showImportPanel,
  closeImportPanel,
}: RaidTrackerMainProps) {
  const domain = useRaidTrackerContext();
  const showIntro =
    domain.characters.length === 0 && domain.dungeons.length === 0;

  return (
    <Stack spacing={2}>
      <AppIntro visible={showIntro} />

      {domain.storageError ? (
        <Alert severity="error">{domain.storageError}</Alert>
      ) : null}

      {forms.showCharacterForm ? (
        <CharacterForm
          name={forms.characterForm.name}
          characterClass={forms.characterForm.characterClass}
          mainSpec={forms.characterForm.mainSpec}
          mainGearScoreText={forms.characterForm.mainGearScoreText}
          offSpec={forms.characterForm.offSpec}
          offGearScoreText={forms.characterForm.offGearScoreText}
          error={forms.characterForm.error}
          onNameChange={forms.characterForm.setName}
          onClassChange={forms.characterForm.setCharacterClass}
          onMainSpecChange={forms.characterForm.setMainSpec}
          onMainGearScoreTextChange={forms.characterForm.setMainGearScoreText}
          onOffSpecChange={forms.characterForm.setOffSpec}
          onOffGearScoreTextChange={forms.characterForm.setOffGearScoreText}
          onCancel={forms.closeCharacterForm}
          onSubmit={forms.characterForm.handleSubmit}
        />
      ) : null}

      {forms.showDungeonForm ? (
        <DungeonForm
          name={forms.dungeonForm.name}
          shortName={forms.dungeonForm.shortName}
          size={forms.dungeonForm.size}
          itemLevelText={forms.dungeonForm.itemLevelText}
          difficulty={forms.dungeonForm.difficulty}
          error={forms.dungeonForm.error}
          onNameChange={forms.dungeonForm.setName}
          onShortNameChange={forms.dungeonForm.setShortName}
          onSizeChange={forms.dungeonForm.setSize}
          onItemLevelTextChange={forms.dungeonForm.setItemLevelText}
          onDifficultyChange={forms.dungeonForm.setDifficulty}
          onCancel={forms.closeDungeonForm}
          onSubmit={forms.dungeonForm.handleSubmit}
        />
      ) : null}

      <RaidTrackerTable
        showImportPanel={showImportPanel}
        closeImportPanel={closeImportPanel}
      />
    </Stack>
  );
}
