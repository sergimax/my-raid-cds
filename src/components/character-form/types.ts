import type { CharacterClass } from "../../types/characters.ts";

export type CharacterFormProps = {
  characterName: string;
  setCharacterName: (value: string) => void;
  characterClass: CharacterClass | "";
  setCharacterClass: (value: CharacterClass | "") => void;
  onSubmit: (e: React.FormEvent) => void;
  duplicateError?: string;
};
