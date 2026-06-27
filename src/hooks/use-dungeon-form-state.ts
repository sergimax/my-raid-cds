import type { SubmitEvent } from "react";
import { useCallback, useState } from "react";
import { defaultDungeonFormValues } from "../constants/dungeon-form-defaults.ts";
import { useTranslation } from "../i18n/use-translation.ts";
import type {
  DungeonDifficulty as DungeonDifficultyValue,
  DungeonRecord,
  DungeonSize,
} from "../types/dungeons.ts";
import { parseDungeonForm } from "../utils/validate-dungeon.ts";
import { generateUUID } from "../uuid.ts";

type UseDungeonFormStateOptions = {
  onDungeonAdded: (dungeon: DungeonRecord) => void;
};

export function useDungeonFormState({
  onDungeonAdded,
}: UseDungeonFormStateOptions) {
  const { locale } = useTranslation();
  const defaults = defaultDungeonFormValues();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setNameState] = useState(defaults.name);
  const [shortName, setShortNameState] = useState(defaults.shortName);
  const [size, setSizeState] = useState<DungeonSize>(defaults.size);
  const [itemLevelText, setItemLevelTextState] = useState(defaults.itemLevelText);
  const [difficulty, setDifficultyState] = useState<DungeonDifficultyValue>(
    defaults.difficulty,
  );
  const [error, setError] = useState("");

  const resetFields = useCallback(() => {
    const nextDefaults = defaultDungeonFormValues();
    setNameState(nextDefaults.name);
    setShortNameState(nextDefaults.shortName);
    setSizeState(nextDefaults.size);
    setItemLevelTextState(nextDefaults.itemLevelText);
    setDifficultyState(nextDefaults.difficulty);
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

  const setShortName = useCallback((nextShortName: string) => {
    setShortNameState(nextShortName);
    setError("");
  }, []);

  const setSize = useCallback((nextSize: DungeonSize) => {
    setSizeState(nextSize);
    setError("");
  }, []);

  const setItemLevelText = useCallback((text: string) => {
    setItemLevelTextState(text);
    setError("");
  }, []);

  const setDifficulty = useCallback((nextDifficulty: DungeonDifficultyValue) => {
    setDifficultyState(nextDifficulty);
    setError("");
  }, []);

  const handleSubmit = useCallback(
    (event: SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();
      setError("");
      const result = parseDungeonForm(
        {
          name,
          shortName,
          size,
          itemLevelText,
          difficulty,
        },
        locale,
      );
      if (!result.ok) {
        setError(result.error);
        return;
      }
      onDungeonAdded({
        id: generateUUID(),
        ...result.fields,
      });
      setIsOpen(false);
      resetFields();
    },
    [difficulty, itemLevelText, locale, name, onDungeonAdded, resetFields, shortName, size],
  );

  return {
    isOpen,
    open,
    close,
    resetFields,
    name,
    setName,
    shortName,
    setShortName,
    size,
    setSize,
    itemLevelText,
    setItemLevelText,
    difficulty,
    setDifficulty,
    error,
    handleSubmit,
  };
}
