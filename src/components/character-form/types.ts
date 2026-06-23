import type { SubmitEvent } from "react";
import type { CharacterClass } from "../../types/characters.ts";

export type CharacterFormProps = {
  name: string;
  characterClass: CharacterClass | "";
  mainSpec: string;
  mainGearScoreText: string;
  offSpec: string;
  offGearScoreText: string;
  error: string;
  onNameChange: (name: string) => void;
  onClassChange: (characterClass: CharacterClass | "") => void;
  onMainSpecChange: (value: string) => void;
  onMainGearScoreTextChange: (value: string) => void;
  onOffSpecChange: (value: string) => void;
  onOffGearScoreTextChange: (value: string) => void;
  onCancel: () => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
};
