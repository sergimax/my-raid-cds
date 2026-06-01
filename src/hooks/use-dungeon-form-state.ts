import type { SubmitEvent } from "react";
import { useCallback, useState } from "react";
import type {
  DungeonDifficulty as DungeonDifficultyValue,
  DungeonRecord,
  DungeonSize,
} from "../types/dungeons.ts";
import {
  defaultDungeonFormValues,
  parseDungeonForm,
} from "../utils/validate-dungeon.ts";
import { generateUUID } from "../uuid.ts";

type UseDungeonFormStateOptions = {
  onDungeonAdded: (dungeon: DungeonRecord) => void;
};

export function useDungeonFormState({ onDungeonAdded }: UseDungeonFormStateOptions) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setNameState] = useState("");
  const [size, setSizeState] = useState<DungeonSize>(
    defaultDungeonFormValues().size,
  );
  const [itemLevelText, setItemLevelTextState] = useState(
    defaultDungeonFormValues().itemLevelText,
  );
  const [difficulty, setDifficultyState] = useState<DungeonDifficultyValue>(
    defaultDungeonFormValues().difficulty,
  );
  const [error, setError] = useState("");

  const resetFields = useCallback(() => {
    const defaults = defaultDungeonFormValues();
    setNameState(defaults.name);
    setSizeState(defaults.size);
    setItemLevelTextState(defaults.itemLevelText);
    setDifficultyState(defaults.difficulty);
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
      const result = parseDungeonForm({
        name,
        size,
        itemLevelText,
        difficulty,
      });
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
    [difficulty, itemLevelText, name, onDungeonAdded, resetFields, size],
  );

  return {
    isOpen,
    open,
    close,
    resetFields,
    name,
    setName,
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
