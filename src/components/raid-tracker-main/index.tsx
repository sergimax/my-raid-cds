import { Alert, Stack } from "@mui/material";
import { useRaidTrackerContext } from "../../hooks/use-raid-tracker-context.ts";
import type { TrackerFormsState } from "../../hooks/use-tracker-forms.ts";
import { useTranslation } from "../../i18n/use-translation.ts";
import type { TranslateFn } from "../../i18n/translate.ts";
import { LOAD_WARNING_CORRUPTED_SAVE } from "../../storage/constants.ts";
import { AppIntro } from "../app-intro/index.tsx";
import { BisListsPanel } from "../bis-lists-panel/index.tsx";
import { CharacterForm } from "../character-form/index.tsx";
import { DungeonForm } from "../dungeon-form/index.tsx";
import { RaidTrackerTable } from "../raid-tracker-table/index.tsx";

type RaidTrackerMainProps = {
  forms: TrackerFormsState;
  showExportPanel: boolean;
  closeExportPanel: () => void;
  showBisListsPanel: boolean;
  closeBisListsPanel: () => void;
};

const STORAGE_QUOTA_MESSAGE = "Storage quota exceeded. Please free up space.";
const STORAGE_SAVE_FAILED_MESSAGE = "Failed to save data. Please try again.";

function localizeStorageMessage(message: string, t: TranslateFn): string {
  if (message === LOAD_WARNING_CORRUPTED_SAVE) {
    return t("storage.corrupted");
  }
  if (message === STORAGE_QUOTA_MESSAGE) {
    return t("storage.quotaExceeded");
  }
  if (message === STORAGE_SAVE_FAILED_MESSAGE) {
    return t("storage.saveFailed");
  }
  return message;
}

export function RaidTrackerMain({
  forms,
  showExportPanel,
  closeExportPanel,
  showBisListsPanel,
  closeBisListsPanel,
}: RaidTrackerMainProps) {
  const { t } = useTranslation();
  const domain = useRaidTrackerContext();
  const showIntro =
    domain.characters.length === 0 && domain.dungeons.length === 0;

  return (
    <Stack spacing={2}>
      <AppIntro visible={showIntro} />

      {domain.storageError ? (
        <Alert severity="error">
          {localizeStorageMessage(domain.storageError, t)}
        </Alert>
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

      {showBisListsPanel ? (
        <BisListsPanel key="bis-lists-panel" onClose={closeBisListsPanel} />
      ) : null}

      <RaidTrackerTable
        showExportPanel={showExportPanel}
        closeExportPanel={closeExportPanel}
      />
    </Stack>
  );
}
