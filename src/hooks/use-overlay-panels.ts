import { useCallback, useState } from "react";
import type { CharacterRecord } from "../types/characters.ts";
import type { DungeonRecord } from "../types/dungeons.ts";
import type { OverlayPanelId } from "./overlay-panel-id.ts";
import { useCharacterFormState } from "./use-character-form-state.ts";
import { useDungeonFormState } from "./use-dungeon-form-state.ts";

type UseOverlayPanelsOptions = {
  characters: CharacterRecord[];
  onCharacterAdded: (character: CharacterRecord) => void;
  onDungeonAdded: (dungeon: DungeonRecord) => void;
};

/** Mutually exclusive toolbar overlay panels (forms, export, BiS lists). */
export function useOverlayPanels({
  characters,
  onCharacterAdded,
  onDungeonAdded,
}: UseOverlayPanelsOptions) {
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [showBisListsPanel, setShowBisListsPanel] = useState(false);
  const characterForm = useCharacterFormState({ characters, onCharacterAdded });
  const dungeonForm = useDungeonFormState({ onDungeonAdded });

  const closeExcept = useCallback((except: OverlayPanelId | null) => {
    if (except !== "export") {
      setShowExportPanel(false);
    }
    if (except !== "bis") {
      setShowBisListsPanel(false);
    }
    if (except !== "character") {
      characterForm.close();
    }
    if (except !== "dungeon") {
      dungeonForm.close();
    }
  }, [characterForm, dungeonForm]);

  const closeAllOverlayPanels = useCallback(() => {
    closeExcept(null);
  }, [closeExcept]);

  const toggleExportPanel = useCallback(() => {
    if (showExportPanel) {
      setShowExportPanel(false);
      return;
    }
    closeExcept("export");
    setShowExportPanel(true);
  }, [closeExcept, showExportPanel]);

  const toggleBisListsPanel = useCallback(() => {
    if (showBisListsPanel) {
      setShowBisListsPanel(false);
      return;
    }
    closeExcept("bis");
    setShowBisListsPanel(true);
  }, [closeExcept, showBisListsPanel]);

  const toggleCharacterForm = useCallback(() => {
    if (characterForm.isOpen) {
      characterForm.close();
      return;
    }
    closeExcept("character");
    characterForm.open();
  }, [characterForm, closeExcept]);

  const toggleDungeonForm = useCallback(() => {
    if (dungeonForm.isOpen) {
      dungeonForm.close();
      return;
    }
    closeExcept("dungeon");
    dungeonForm.open();
  }, [closeExcept, dungeonForm]);

  const closeExportPanel = useCallback(() => {
    setShowExportPanel(false);
  }, []);

  const closeBisListsPanel = useCallback(() => {
    setShowBisListsPanel(false);
  }, []);

  return {
    showExportPanel,
    closeExportPanel,
    toggleExportPanel,
    showBisListsPanel,
    closeBisListsPanel,
    toggleBisListsPanel,
    closeAllOverlayPanels,
    showCharacterForm: characterForm.isOpen,
    showDungeonForm: dungeonForm.isOpen,
    closeCharacterForm: characterForm.close,
    closeDungeonForm: dungeonForm.close,
    toggleCharacterForm,
    toggleDungeonForm,
    characterForm: {
      name: characterForm.name,
      setName: characterForm.setName,
      characterClass: characterForm.characterClass,
      setCharacterClass: characterForm.setCharacterClass,
      mainSpec: characterForm.mainSpec,
      setMainSpec: characterForm.setMainSpec,
      mainGearScoreText: characterForm.mainGearScoreText,
      setMainGearScoreText: characterForm.setMainGearScoreText,
      offSpec: characterForm.offSpec,
      setOffSpec: characterForm.setOffSpec,
      offGearScoreText: characterForm.offGearScoreText,
      setOffGearScoreText: characterForm.setOffGearScoreText,
      error: characterForm.error,
      handleSubmit: characterForm.handleSubmit,
    },
    dungeonForm: {
      name: dungeonForm.name,
      setName: dungeonForm.setName,
      shortName: dungeonForm.shortName,
      setShortName: dungeonForm.setShortName,
      size: dungeonForm.size,
      setSize: dungeonForm.setSize,
      itemLevelText: dungeonForm.itemLevelText,
      setItemLevelText: dungeonForm.setItemLevelText,
      difficulty: dungeonForm.difficulty,
      setDifficulty: dungeonForm.setDifficulty,
      error: dungeonForm.error,
      handleSubmit: dungeonForm.handleSubmit,
    },
  };
}

export type OverlayPanelsState = ReturnType<typeof useOverlayPanels>;

/** Form fields and toggles exposed to RaidTrackerMain (subset of overlay panel state). */
export type TrackerFormsState = Pick<
  OverlayPanelsState,
  | "showCharacterForm"
  | "showDungeonForm"
  | "closeCharacterForm"
  | "closeDungeonForm"
  | "toggleCharacterForm"
  | "toggleDungeonForm"
  | "characterForm"
  | "dungeonForm"
>;

export function pickTrackerFormsState(
  overlayPanels: OverlayPanelsState,
): TrackerFormsState {
  return {
    showCharacterForm: overlayPanels.showCharacterForm,
    showDungeonForm: overlayPanels.showDungeonForm,
    closeCharacterForm: overlayPanels.closeCharacterForm,
    closeDungeonForm: overlayPanels.closeDungeonForm,
    toggleCharacterForm: overlayPanels.toggleCharacterForm,
    toggleDungeonForm: overlayPanels.toggleDungeonForm,
    characterForm: overlayPanels.characterForm,
    dungeonForm: overlayPanels.dungeonForm,
  };
}
