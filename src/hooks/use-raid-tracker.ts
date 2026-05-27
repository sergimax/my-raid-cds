import type { SubmitEvent } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DungeonList } from "../data/dungeons.ts";
import { loadRaidTrackerState, saveRaidTrackerState } from "../storage.ts";
import {
  type CharacterClass,
  type CharacterRecord,
} from "../types/characters.ts";
import {
  DungeonDifficulty,
  type DungeonDifficulty as DungeonDifficultyValue,
  type DungeonRecord,
  type DungeonSize,
  type DungeonToggles,
} from "../types/dungeons.ts";
import { parseItemLevelInput } from "../utils/parse-item-level-input.ts";
import { generateUUID } from "../uuid.ts";

export function useRaidTracker() {
  const [initialState] = useState(loadRaidTrackerState);
  const [characters, setCharacters] = useState<CharacterRecord[]>(
    initialState.characters,
  );
  const [dungeons, setDungeons] = useState<DungeonRecord[]>(initialState.dungeons);
  const [dungeonToggles, setDungeonToggles] = useState<DungeonToggles>(
    initialState.dungeonToggles,
  );
  const [storageError, setStorageError] = useState<string | null>(null);

  const [showCharacterForm, setShowCharacterForm] = useState(false);
  const [showDungeonForm, setShowDungeonForm] = useState(false);

  const [newCharacterName, setNewCharacterName] = useState("");
  const [newCharacterClass, setNewCharacterClass] = useState<CharacterClass | "">(
    "",
  );
  const [characterFormError, setCharacterFormError] = useState("");

  const [newDungeonName, setNewDungeonName] = useState("");
  const [newDungeonSize, setNewDungeonSize] = useState<DungeonSize>(10);
  const [newDungeonItemLevelText, setNewDungeonItemLevelText] = useState("200");
  const [newDungeonDifficulty, setNewDungeonDifficulty] =
    useState<DungeonDifficultyValue>(DungeonDifficulty.NORMAL);
  const [dungeonFormError, setDungeonFormError] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      saveRaidTrackerState(
        { characters, dungeons, dungeonToggles },
        (errorMessage) => {
          setStorageError(errorMessage);
        },
      );
    }, 400);
    return () => clearTimeout(timeout);
  }, [characters, dungeons, dungeonToggles]);

  const handleDungeonToggle = useCallback(
    (characterId: string, dungeonId: string) => {
      setDungeonToggles((previous) => {
        const previousForCharacter = previous[characterId] ?? {};
        const nextValue = !(previousForCharacter[dungeonId] ?? false);
        return {
          ...previous,
          [characterId]: {
            ...previousForCharacter,
            [dungeonId]: nextValue,
          },
        };
      });
    },
    [],
  );

  const handleCharacterFormSubmit = useCallback(
    (event: SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();
      setCharacterFormError("");
      const trimmedName = newCharacterName.trim();
      if (!trimmedName || !newCharacterClass) {
        setCharacterFormError("Enter a name and choose a class.");
        return;
      }
      const isDuplicate = characters.some(
        (existing) =>
          existing.name.toLowerCase() === trimmedName.toLowerCase() &&
          existing.class?.name === newCharacterClass.name,
      );
      if (isDuplicate) {
        setCharacterFormError(
          "A character with this name and class already exists.",
        );
        return;
      }
      const newCharacter: CharacterRecord = {
        id: generateUUID(),
        name: trimmedName,
        class: newCharacterClass,
      };
      setCharacters((previous) => [...previous, newCharacter]);
      setNewCharacterName("");
      setNewCharacterClass("");
      setShowCharacterForm(false);
    },
    [characters, newCharacterClass, newCharacterName],
  );

  const handleDungeonFormSubmit = useCallback(
    (event: SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();
      setDungeonFormError("");
      const trimmedName = newDungeonName.trim();
      if (!trimmedName) {
        setDungeonFormError("Enter a dungeon name.");
        return;
      }
      const itemLevels = parseItemLevelInput(newDungeonItemLevelText);
      if (itemLevels.length === 0) {
        setDungeonFormError(
          "Enter at least one item level (e.g. 200 or range like 200 / 213).",
        );
        return;
      }
      const newDungeon: DungeonRecord = {
        id: generateUUID(),
        name: trimmedName,
        size: newDungeonSize,
        itemLevel: itemLevels,
        difficulty: newDungeonDifficulty,
      };
      setDungeons((previous) => [...previous, newDungeon]);
      setNewDungeonName("");
      setNewDungeonSize(10);
      setNewDungeonItemLevelText("200");
      setNewDungeonDifficulty(DungeonDifficulty.NORMAL);
      setShowDungeonForm(false);
    },
    [
      newDungeonDifficulty,
      newDungeonItemLevelText,
      newDungeonName,
      newDungeonSize,
    ],
  );

  const handleAddFromTemplate = useCallback(() => {
    setDungeons((previousDungeons) => {
      const templateDungeons = DungeonList.map((templateDungeon) => ({
        ...templateDungeon,
        id: generateUUID(),
      }));
      return [...previousDungeons, ...templateDungeons];
    });
  }, []);

  const handleDeleteCharacter = useCallback((characterId: string) => {
    setCharacters((previous) =>
      previous.filter((character) => character.id !== characterId),
    );
    setDungeonToggles((previous) => {
      const next = { ...previous };
      delete next[characterId];
      return next;
    });
  }, []);

  const handleDeleteDungeon = useCallback((dungeonId: string) => {
    setDungeons((previous) =>
      previous.filter((dungeon) => dungeon.id !== dungeonId),
    );
    setDungeonToggles((previous) => {
      const next: DungeonToggles = {};
      for (const [characterId, togglesByDungeon] of Object.entries(previous)) {
        const nextForCharacter = { ...togglesByDungeon };
        delete nextForCharacter[dungeonId];
        next[characterId] = nextForCharacter;
      }
      return next;
    });
  }, []);

  const handleResetAllToggles = useCallback(() => {
    setDungeonToggles({});
  }, []);

  const handleResetCharacterToggles = useCallback((characterId: string) => {
    setDungeonToggles((previous) => ({
      ...previous,
      [characterId]: {},
    }));
  }, []);

  const canResetAllToggles = useMemo(() => {
    for (const toggles of Object.values(dungeonToggles)) {
      for (const value of Object.values(toggles)) {
        if (value) return true;
      }
    }
    return false;
  }, [dungeonToggles]);

  const toggleCharacterForm = useCallback(() => {
    setShowCharacterForm((previous) => {
      const next = !previous;
      if (next) setShowDungeonForm(false);
      return next;
    });
  }, []);

  const toggleDungeonForm = useCallback(() => {
    setShowDungeonForm((previous) => {
      const next = !previous;
      if (next) setShowCharacterForm(false);
      return next;
    });
  }, []);

  const setNewCharacterNameWithClear = useCallback((name: string) => {
    setNewCharacterName(name);
    setCharacterFormError("");
  }, []);

  const setNewCharacterClassWithClear = useCallback(
    (characterClass: CharacterClass | "") => {
      setNewCharacterClass(characterClass);
      setCharacterFormError("");
    },
    [],
  );

  const setNewDungeonNameWithClear = useCallback((name: string) => {
    setNewDungeonName(name);
    setDungeonFormError("");
  }, []);

  const setNewDungeonSizeWithClear = useCallback((size: DungeonSize) => {
    setNewDungeonSize(size);
    setDungeonFormError("");
  }, []);

  const setNewDungeonItemLevelTextWithClear = useCallback((text: string) => {
    setNewDungeonItemLevelText(text);
    setDungeonFormError("");
  }, []);

  const setNewDungeonDifficultyWithClear = useCallback(
    (difficulty: DungeonDifficultyValue) => {
      setNewDungeonDifficulty(difficulty);
      setDungeonFormError("");
    },
    [],
  );

  return {
    characters,
    dungeons,
    dungeonToggles,
    storageError,

    showCharacterForm,
    showDungeonForm,
    toggleCharacterForm,
    toggleDungeonForm,

    newCharacterName,
    setNewCharacterName: setNewCharacterNameWithClear,
    newCharacterClass,
    setNewCharacterClass: setNewCharacterClassWithClear,
    characterFormError,
    handleCharacterFormSubmit,

    newDungeonName,
    setNewDungeonName: setNewDungeonNameWithClear,
    newDungeonSize,
    setNewDungeonSize: setNewDungeonSizeWithClear,
    newDungeonItemLevelText,
    setNewDungeonItemLevelText: setNewDungeonItemLevelTextWithClear,
    newDungeonDifficulty,
    setNewDungeonDifficulty: setNewDungeonDifficultyWithClear,
    dungeonFormError,
    handleDungeonFormSubmit,

    handleDungeonToggle,
    handleDeleteCharacter,
    handleDeleteDungeon,
    handleAddFromTemplate,
    handleResetAllToggles,
    handleResetCharacterToggles,
    canResetAllToggles,
  };
}
