import type { SubmitEvent } from "react";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "../i18n/use-translation.ts";
import type { CharacterClass, CharacterRecord } from "../types/characters.ts";
import { isSpecValidForClass } from "../data/class-specs.ts";
import { parseCharacterForm } from "../utils/validate-character.ts";
import { generateUUID } from "../uuid.ts";

type UseCharacterFormStateOptions = {
  characters: CharacterRecord[];
  onCharacterAdded: (character: CharacterRecord) => void;
  /** Called after a successful submit closes the form. */
  onSubmitted?: () => void;
};

const EMPTY_SPEC_GEAR_FIELDS = {
  mainSpec: "",
  mainGearScoreText: "",
  offSpec: "",
  offGearScoreText: "",
} as const;

export function useCharacterFormState({
  characters,
  onCharacterAdded,
  onSubmitted,
}: UseCharacterFormStateOptions) {
  const { locale } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setNameState] = useState("");
  const [characterClass, setCharacterClassState] = useState<CharacterClass | "">(
    "",
  );
  const [mainSpec, setMainSpecState] = useState("");
  const [mainGearScoreText, setMainGearScoreTextState] = useState("");
  const [offSpec, setOffSpecState] = useState("");
  const [offGearScoreText, setOffGearScoreTextState] = useState("");
  const [error, setError] = useState("");

  const resetFields = useCallback(() => {
    setNameState("");
    setCharacterClassState("");
    setMainSpecState(EMPTY_SPEC_GEAR_FIELDS.mainSpec);
    setMainGearScoreTextState(EMPTY_SPEC_GEAR_FIELDS.mainGearScoreText);
    setOffSpecState(EMPTY_SPEC_GEAR_FIELDS.offSpec);
    setOffGearScoreTextState(EMPTY_SPEC_GEAR_FIELDS.offGearScoreText);
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
    if (nextClass === "") {
      setMainSpecState("");
      setOffSpecState("");
    } else {
      setMainSpecState((previous) =>
        isSpecValidForClass(nextClass.name, previous) ? previous : "",
      );
      setOffSpecState((previous) =>
        isSpecValidForClass(nextClass.name, previous) ? previous : "",
      );
    }
    setError("");
  }, []);

  const setMainSpec = useCallback((value: string) => {
    setMainSpecState(value);
    setError("");
  }, []);

  const setMainGearScoreText = useCallback((value: string) => {
    setMainGearScoreTextState(value);
    setError("");
  }, []);

  const setOffSpec = useCallback((value: string) => {
    setOffSpecState(value);
    setError("");
  }, []);

  const setOffGearScoreText = useCallback((value: string) => {
    setOffGearScoreTextState(value);
    setError("");
  }, []);

  const handleSubmit = useCallback(
    (event: SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();
      setError("");
      const result = parseCharacterForm(
        {
          name,
          characterClass,
          mainSpec,
          mainGearScoreText,
          offSpec,
          offGearScoreText,
        },
        characters,
        locale,
      );
      if (!result.ok) {
        setError(result.error);
        return;
      }
      onCharacterAdded({
        id: generateUUID(),
        name: result.name,
        class: result.characterClass,
        ...(result.mainSpec ? { mainSpec: result.mainSpec } : {}),
        ...(result.offSpec ? { offSpec: result.offSpec } : {}),
      });
      setIsOpen(false);
      resetFields();
      onSubmitted?.();
    },
    [
      characterClass,
      characters,
      mainGearScoreText,
      mainSpec,
      name,
      offGearScoreText,
      offSpec,
      locale,
      onCharacterAdded,
      onSubmitted,
      resetFields,
    ],
  );

  return useMemo(
    () => ({
      isOpen,
      open,
      close,
      resetFields,
      name,
      setName,
      characterClass,
      setCharacterClass,
      mainSpec,
      setMainSpec,
      mainGearScoreText,
      setMainGearScoreText,
      offSpec,
      setOffSpec,
      offGearScoreText,
      setOffGearScoreText,
      error,
      handleSubmit,
    }),
    [
      characterClass,
      close,
      error,
      handleSubmit,
      isOpen,
      mainGearScoreText,
      mainSpec,
      name,
      offGearScoreText,
      offSpec,
      open,
      resetFields,
      setCharacterClass,
      setMainGearScoreText,
      setMainSpec,
      setName,
      setOffGearScoreText,
      setOffSpec,
    ],
  );
}
