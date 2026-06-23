import { useCallback } from "react";
import type { CharacterRecord } from "../types/characters.ts";
import type { DungeonRecord } from "../types/dungeons.ts";
import { useCharacterFormState } from "./use-character-form-state.ts";
import { useDungeonFormState } from "./use-dungeon-form-state.ts";

type UseTrackerFormsOptions = {
  characters: CharacterRecord[];
  onCharacterAdded: (character: CharacterRecord) => void;
  onDungeonAdded: (dungeon: DungeonRecord) => void;
  closeImportPanel: () => void;
};

/** Character and dungeon add forms with mutual exclusivity when toggled open. */
export function useTrackerForms({
  characters,
  onCharacterAdded,
  onDungeonAdded,
  closeImportPanel,
}: UseTrackerFormsOptions) {
  const characterForm = useCharacterFormState({ characters, onCharacterAdded });
  const dungeonForm = useDungeonFormState({ onDungeonAdded });

  const toggleCharacterForm = useCallback(() => {
    if (characterForm.isOpen) {
      characterForm.close();
      return;
    }
    closeImportPanel();
    dungeonForm.close();
    characterForm.open();
  }, [characterForm, closeImportPanel, dungeonForm]);

  const toggleDungeonForm = useCallback(() => {
    if (dungeonForm.isOpen) {
      dungeonForm.close();
      return;
    }
    closeImportPanel();
    characterForm.close();
    dungeonForm.open();
  }, [characterForm, closeImportPanel, dungeonForm]);

  return {
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

export type TrackerFormsState = ReturnType<typeof useTrackerForms>;
