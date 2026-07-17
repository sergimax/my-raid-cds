import { Container } from "@mui/material";
import { useCallback, useMemo } from "react";
import {
  pickTrackerFormsState,
  useOverlayPanels,
} from "../../hooks/use-overlay-panels.ts";
import { useRaidTrackerContext } from "../../hooks/use-raid-tracker-context.ts";
import { AppHeader } from "../app-header/index.tsx";
import { RaidTrackerMain } from "../raid-tracker-main/index.tsx";
import { TrackerControls } from "../tracker-controls/index.tsx";
import type { TrackerControlsSource } from "../tracker-controls/types.ts";

export function TrackerLayout() {
  const domain = useRaidTrackerContext();
  const overlayPanels = useOverlayPanels({
    characters: domain.characters,
    onCharacterAdded: domain.addCharacter,
    onDungeonAdded: domain.addDungeon,
  });
  const forms = pickTrackerFormsState(overlayPanels);

  const handleAddFromTemplate = useCallback(() => {
    overlayPanels.closeAllOverlayPanels();
    domain.handleAddFromTemplate();
  }, [domain, overlayPanels]);

  const handleResetAllToggles = useCallback(() => {
    overlayPanels.closeAllOverlayPanels();
    domain.handleResetAllToggles();
  }, [domain, overlayPanels]);

  const controlsSource = useMemo(
    (): TrackerControlsSource => ({
      charactersCount: domain.characters.length,
      dungeonsCount: domain.dungeons.length,
      canResetAllToggles: domain.canResetAllToggles,
      handleAddFromTemplate,
      handleResetAllToggles,
      showCharacterForm: overlayPanels.showCharacterForm,
      showDungeonForm: overlayPanels.showDungeonForm,
      showExportPanel: overlayPanels.showExportPanel,
      showGearPickPanel: overlayPanels.showGearPickPanel,
      showBisListsPanel: overlayPanels.showBisListsPanel,
      toggleCharacterForm: overlayPanels.toggleCharacterForm,
      toggleDungeonForm: overlayPanels.toggleDungeonForm,
      toggleExportPanel: overlayPanels.toggleExportPanel,
      toggleGearPickPanel: overlayPanels.toggleGearPickPanel,
      toggleBisListsPanel: overlayPanels.toggleBisListsPanel,
    }),
    [
      domain.canResetAllToggles,
      domain.characters.length,
      domain.dungeons.length,
      handleAddFromTemplate,
      handleResetAllToggles,
      overlayPanels.showBisListsPanel,
      overlayPanels.showCharacterForm,
      overlayPanels.showDungeonForm,
      overlayPanels.showExportPanel,
      overlayPanels.showGearPickPanel,
      overlayPanels.toggleBisListsPanel,
      overlayPanels.toggleCharacterForm,
      overlayPanels.toggleDungeonForm,
      overlayPanels.toggleExportPanel,
      overlayPanels.toggleGearPickPanel,
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
          showExportPanel={overlayPanels.showExportPanel}
          closeExportPanel={overlayPanels.closeExportPanel}
          showGearPickPanel={overlayPanels.showGearPickPanel}
          closeGearPickPanel={overlayPanels.closeGearPickPanel}
          showBisListsPanel={overlayPanels.showBisListsPanel}
          closeBisListsPanel={overlayPanels.closeBisListsPanel}
        />
      </Container>
    </div>
  );
}
