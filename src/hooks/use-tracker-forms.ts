import { useCallback } from "react";
import type { CharacterRecord } from "../types/characters.ts";
import type { DungeonRecord } from "../types/dungeons.ts";
import { useCharacterFormState } from "./use-character-form-state.ts";
import { useDungeonFormState } from "./use-dungeon-form-state.ts";

type UseTrackerFormsOptions = {
  characters: CharacterRecord[];
  onCharacterAdded: (character: CharacterRecord) => void;
  onDungeonAdded: (dungeon: DungeonRecord) => void;
};

/** Character and dungeon add forms with mutual exclusivity when toggled open. */
export function useTrackerForms({
  characters,
  onCharacterAdded,
  onDungeonAdded,
}: UseTrackerFormsOptions) {
  const characterForm = useCharacterFormState({ characters, onCharacterAdded });
  const dungeonForm = useDungeonFormState({ onDungeonAdded });

  const toggleCharacterForm = useCallback(() => {
    if (characterForm.isOpen) {
      characterForm.close();
      return;
    }
    dungeonForm.close();
    characterForm.open();
  }, [characterForm, dungeonForm]);

  const toggleDungeonForm = useCallback(() => {
    if (dungeonForm.isOpen) {
      dungeonForm.close();
      return;
    }
    characterForm.close();
    dungeonForm.open();
  }, [characterForm, dungeonForm]);

  return {
    showCharacterForm: characterForm.isOpen,
    showDungeonForm: dungeonForm.isOpen,
    closeCharacterForm: characterForm.close,
    closeDungeonForm: dungeonForm.close,
    toggleCharacterForm,
    toggleDungeonForm,

    newCharacterName: characterForm.name,
    setNewCharacterName: characterForm.setName,
    newCharacterClass: characterForm.characterClass,
    setNewCharacterClass: characterForm.setCharacterClass,
    characterFormError: characterForm.error,
    handleCharacterFormSubmit: characterForm.handleSubmit,

    newDungeonName: dungeonForm.name,
    setNewDungeonName: dungeonForm.setName,
    newDungeonSize: dungeonForm.size,
    setNewDungeonSize: dungeonForm.setSize,
    newDungeonItemLevelText: dungeonForm.itemLevelText,
    setNewDungeonItemLevelText: dungeonForm.setItemLevelText,
    newDungeonDifficulty: dungeonForm.difficulty,
    setNewDungeonDifficulty: dungeonForm.setDifficulty,
    dungeonFormError: dungeonForm.error,
    handleDungeonFormSubmit: dungeonForm.handleSubmit,
  };
}
