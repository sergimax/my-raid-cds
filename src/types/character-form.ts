import type { FormEvent } from "react";
import type { CharacterClass } from "./characters.ts";

export type CharacterFormProps = {
  characterName: string;
  setCharacterName: (value: string) => void;
  characterClass: CharacterClass | "";
  setCharacterClass: (value: CharacterClass | "") => void;
  onSubmit: (event: FormEvent) => void;
  duplicateError?: string;
};
