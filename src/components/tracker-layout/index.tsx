import { Container } from "@mui/material";
import { useCallback, useMemo } from "react";
import { useExportPanelState } from "../../hooks/use-export-panel-state.ts";
import { useRaidTrackerContext } from "../../hooks/use-raid-tracker-context.ts";
import { useTrackerForms } from "../../hooks/use-tracker-forms.ts";
import { AppHeader } from "../app-header/index.tsx";
import { RaidTrackerMain } from "../raid-tracker-main/index.tsx";
import { TrackerControls } from "../tracker-controls/index.tsx";
import type { TrackerControlsSource } from "../tracker-controls/types.ts";

export function TrackerLayout() {
  const domain = useRaidTrackerContext();
  const exportPanel = useExportPanelState();
  const forms = useTrackerForms({
    characters: domain.characters,
    onCharacterAdded: domain.addCharacter,
    onDungeonAdded: domain.addDungeon,
    closeExportPanel: exportPanel.closeExportPanel,
  });

  const toggleExportPanel = useCallback(() => {
    if (exportPanel.showExportPanel) {
      exportPanel.closeExportPanel();
      return;
    }
    forms.closeCharacterForm();
    forms.closeDungeonForm();
    exportPanel.openExportPanel();
  }, [exportPanel, forms]);

  const controlsSource = useMemo(
    (): TrackerControlsSource => ({
      charactersCount: domain.characters.length,
      dungeonsCount: domain.dungeons.length,
      canResetAllToggles: domain.canResetAllToggles,
      handleAddFromTemplate: domain.handleAddFromTemplate,
      handleResetAllToggles: domain.handleResetAllToggles,
      showCharacterForm: forms.showCharacterForm,
      showDungeonForm: forms.showDungeonForm,
      showExportPanel: exportPanel.showExportPanel,
      toggleCharacterForm: forms.toggleCharacterForm,
      toggleDungeonForm: forms.toggleDungeonForm,
      toggleExportPanel,
    }),
    [
      domain.canResetAllToggles,
      domain.characters.length,
      domain.dungeons.length,
      domain.handleAddFromTemplate,
      domain.handleResetAllToggles,
      exportPanel.showExportPanel,
      forms.showCharacterForm,
      forms.showDungeonForm,
      forms.toggleCharacterForm,
      forms.toggleDungeonForm,
      toggleExportPanel,
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
          showExportPanel={exportPanel.showExportPanel}
          closeExportPanel={exportPanel.closeExportPanel}
        />
      </Container>
    </div>
  );
}
