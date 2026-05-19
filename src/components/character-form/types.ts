import type { FormEvent } from "react";
import type { CharacterClass } from "../../types/characters.ts";

export type CharacterFormProps = {
  name: string;
  characterClass: CharacterClass | "";
  error: string;
  onNameChange: (name: string) => void;
  onClassChange: (characterClass: CharacterClass | "") => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};
