import { Container } from "@mui/material";
import { useCallback, useMemo } from "react";
import { useImportPanelState } from "../../hooks/use-import-panel-state.ts";
import { useRaidTrackerContext } from "../../hooks/use-raid-tracker-context.ts";
import { useTrackerForms } from "../../hooks/use-tracker-forms.ts";
import { AppHeader } from "../app-header/index.tsx";
import { RaidTrackerMain } from "../raid-tracker-main/index.tsx";
import { TrackerControls } from "../tracker-controls/index.tsx";
import type { TrackerControlsSource } from "../tracker-controls/types.ts";

export function TrackerLayout() {
  const domain = useRaidTrackerContext();
  const importPanel = useImportPanelState();
  const forms = useTrackerForms({
    characters: domain.characters,
    onCharacterAdded: domain.addCharacter,
    onDungeonAdded: domain.addDungeon,
    closeImportPanel: importPanel.closeImportPanel,
  });

  const toggleImportPanel = useCallback(() => {
    if (importPanel.showImportPanel) {
      importPanel.closeImportPanel();
      return;
    }
    forms.closeCharacterForm();
    forms.closeDungeonForm();
    importPanel.openImportPanel();
  }, [forms, importPanel]);

  const controlsSource = useMemo(
    (): TrackerControlsSource => ({
      charactersCount: domain.characters.length,
      dungeonsCount: domain.dungeons.length,
      canResetAllToggles: domain.canResetAllToggles,
      handleAddFromTemplate: domain.handleAddFromTemplate,
      handleResetAllToggles: domain.handleResetAllToggles,
      showCharacterForm: forms.showCharacterForm,
      showDungeonForm: forms.showDungeonForm,
      showImportPanel: importPanel.showImportPanel,
      toggleCharacterForm: forms.toggleCharacterForm,
      toggleDungeonForm: forms.toggleDungeonForm,
      toggleImportPanel,
    }),
    [
      domain.canResetAllToggles,
      domain.characters.length,
      domain.dungeons.length,
      domain.handleAddFromTemplate,
      domain.handleResetAllToggles,
      forms.showCharacterForm,
      forms.showDungeonForm,
      forms.toggleCharacterForm,
      forms.toggleDungeonForm,
      importPanel.showImportPanel,
      toggleImportPanel,
    ],
  );

  return (
    <div className="app-shell">
      <AppHeader center={<TrackerControls source={controlsSource} />} />
      <Container
        className="app-main"
        component="main"
        maxWidth={false}
        disableGutters
      >
        <RaidTrackerMain
          forms={forms}
          showImportPanel={importPanel.showImportPanel}
          closeImportPanel={importPanel.closeImportPanel}
        />
      </Container>
    </div>
  );
}
