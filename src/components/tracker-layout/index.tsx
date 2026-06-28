import { Container } from "@mui/material";
import { useCallback, useMemo } from "react";
import { useExportPanelState } from "../../hooks/use-export-panel-state.ts";
import { useBisListsPanelState } from "../../hooks/use-bis-lists-panel-state.ts";
import { useRaidTrackerContext } from "../../hooks/use-raid-tracker-context.ts";
import { useTrackerForms } from "../../hooks/use-tracker-forms.ts";
import { AppHeader } from "../app-header/index.tsx";
import { RaidTrackerMain } from "../raid-tracker-main/index.tsx";
import { TrackerControls } from "../tracker-controls/index.tsx";
import type { TrackerControlsSource } from "../tracker-controls/types.ts";

export function TrackerLayout() {
  const domain = useRaidTrackerContext();
  const exportPanel = useExportPanelState();
  const bisListsPanel = useBisListsPanelState();

  const forms = useTrackerForms({
    characters: domain.characters,
    onCharacterAdded: domain.addCharacter,
    onDungeonAdded: domain.addDungeon,
    closeExportPanel: exportPanel.closeExportPanel,
    closeBisListsPanel: bisListsPanel.closeBisListsPanel,
  });

  const closeOverlayPanels = useCallback(() => {
    exportPanel.closeExportPanel();
    bisListsPanel.closeBisListsPanel();
    forms.closeCharacterForm();
    forms.closeDungeonForm();
  }, [bisListsPanel, exportPanel, forms]);

  const handleAddFromTemplate = useCallback(() => {
    closeOverlayPanels();
    domain.handleAddFromTemplate();
  }, [closeOverlayPanels, domain]);

  const handleResetAllToggles = useCallback(() => {
    closeOverlayPanels();
    domain.handleResetAllToggles();
  }, [closeOverlayPanels, domain]);

  const toggleExportPanel = useCallback(() => {
    if (exportPanel.showExportPanel) {
      exportPanel.closeExportPanel();
      return;
    }
    forms.closeCharacterForm();
    forms.closeDungeonForm();
    bisListsPanel.closeBisListsPanel();
    exportPanel.openExportPanel();
  }, [bisListsPanel, exportPanel, forms]);

  const toggleBisListsPanel = useCallback(() => {
    if (bisListsPanel.showBisListsPanel) {
      bisListsPanel.closeBisListsPanel();
      return;
    }
    forms.closeCharacterForm();
    forms.closeDungeonForm();
    exportPanel.closeExportPanel();
    bisListsPanel.openBisListsPanel();
  }, [bisListsPanel, exportPanel, forms]);

  const controlsSource = useMemo(
    (): TrackerControlsSource => ({
      charactersCount: domain.characters.length,
      dungeonsCount: domain.dungeons.length,
      canResetAllToggles: domain.canResetAllToggles,
      handleAddFromTemplate,
      handleResetAllToggles,
      showCharacterForm: forms.showCharacterForm,
      showDungeonForm: forms.showDungeonForm,
      showExportPanel: exportPanel.showExportPanel,
      showBisListsPanel: bisListsPanel.showBisListsPanel,
      toggleCharacterForm: forms.toggleCharacterForm,
      toggleDungeonForm: forms.toggleDungeonForm,
      toggleExportPanel,
      toggleBisListsPanel,
    }),
    [
      bisListsPanel.showBisListsPanel,
      domain.canResetAllToggles,
      domain.characters.length,
      domain.dungeons.length,
      handleAddFromTemplate,
      handleResetAllToggles,
      exportPanel.showExportPanel,
      forms.showCharacterForm,
      forms.showDungeonForm,
      forms.toggleCharacterForm,
      forms.toggleDungeonForm,
      toggleBisListsPanel,
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
          showBisListsPanel={bisListsPanel.showBisListsPanel}
          closeBisListsPanel={bisListsPanel.closeBisListsPanel}
        />
      </Container>
    </div>
  );
}
