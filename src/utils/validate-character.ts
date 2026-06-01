import { MAX_CHARACTER_NAME_LENGTH } from "../constants/character.ts";
import type { CharacterClass, CharacterRecord } from "../types/characters.ts";

export type CharacterFormValues = {
  name: string;
  characterClass: CharacterClass | "";
};

export type ParseCharacterFormResult =
  | { ok: true; name: string; characterClass: CharacterClass }
  | { ok: false; error: string };

export function parseCharacterForm(
  values: CharacterFormValues,
  existingCharacters: CharacterRecord[],
): ParseCharacterFormResult {
  const trimmedName = values.name.trim();
  const { characterClass } = values;
  if (!trimmedName || !characterClass) {
    return { ok: false, error: "Enter a name and choose a class." };
  }
  if (trimmedName.length > MAX_CHARACTER_NAME_LENGTH) {
    return {
      ok: false,
      error: `Character name must be at most ${MAX_CHARACTER_NAME_LENGTH} characters.`,
    };
  }
  const isDuplicate = existingCharacters.some(
    (existing) =>
      existing.name.toLowerCase() === trimmedName.toLowerCase() &&
      existing.class?.name === characterClass.name,
  );
  if (isDuplicate) {
    return {
      ok: false,
      error: "A character with this name and class already exists.",
    };
  }
  return { ok: true, name: trimmedName, characterClass };
}
