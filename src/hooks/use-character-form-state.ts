import type { SubmitEvent } from "react";
import { useCallback, useState } from "react";
import type { CharacterClass, CharacterRecord } from "../types/characters.ts";
import { parseCharacterForm } from "../utils/validate-character.ts";
import { generateUUID } from "../uuid.ts";

type UseCharacterFormStateOptions = {
  characters: CharacterRecord[];
  onCharacterAdded: (character: CharacterRecord) => void;
};

export function useCharacterFormState({
  characters,
  onCharacterAdded,
}: UseCharacterFormStateOptions) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setNameState] = useState("");
  const [characterClass, setCharacterClassState] = useState<CharacterClass | "">(
    "",
  );
  const [error, setError] = useState("");

  const resetFields = useCallback(() => {
    setNameState("");
    setCharacterClassState("");
    setError("");
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    resetFields();
  }, [resetFields]);

  const setName = useCallback((nextName: string) => {
    setNameState(nextName);
    setError("");
  }, []);

  const setCharacterClass = useCallback((nextClass: CharacterClass | "") => {
    setCharacterClassState(nextClass);
    setError("");
  }, []);

  const handleSubmit = useCallback(
    (event: SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();
      setError("");
      const result = parseCharacterForm(
        { name, characterClass },
        characters,
      );
      if (!result.ok) {
        setError(result.error);
        return;
      }
      onCharacterAdded({
        id: generateUUID(),
        name: result.name,
        class: result.characterClass,
      });
      setIsOpen(false);
      resetFields();
    },
    [characterClass, characters, name, onCharacterAdded, resetFields],
  );

  return {
    isOpen,
    open,
    close,
    resetFields,
    name,
    setName,
    characterClass,
    setCharacterClass,
    error,
    handleSubmit,
  };
}
