import { useCallback, useEffect, useMemo, useState } from "react";
import { DungeonList } from "../data/dungeons.ts";
import { loadRaidTrackerState, saveRaidTrackerState } from "../storage/index.ts";
import type { CharacterRecord } from "../types/characters.ts";
import type { DungeonRecord, DungeonToggles } from "../types/dungeons.ts";
import { generateUUID } from "../uuid.ts";
import { useImportPanelState } from "./use-import-panel-state.ts";
import { useTrackerForms } from "./use-tracker-forms.ts";

export function useRaidTracker() {
  const [initialLoad] = useState(loadRaidTrackerState);
  const [characters, setCharacters] = useState<CharacterRecord[]>(
    initialLoad.state.characters,
  );
  const [dungeons, setDungeons] = useState<DungeonRecord[]>(
    initialLoad.state.dungeons,
  );
  const [dungeonToggles, setDungeonToggles] = useState<DungeonToggles>(
    initialLoad.state.dungeonToggles,
  );
  const [storageError, setStorageError] = useState<string | null>(
    initialLoad.loadWarning,
  );

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

  const onCharacterAdded = useCallback((character: CharacterRecord) => {
    setCharacters((previous) => [...previous, character]);
  }, []);

  const onDungeonAdded = useCallback((dungeon: DungeonRecord) => {
    setDungeons((previous) => [...previous, dungeon]);
  }, []);

  const importPanel = useImportPanelState();

  const forms = useTrackerForms({
    characters,
    onCharacterAdded,
    onDungeonAdded,
    closeImportPanel: importPanel.closeImportPanel,
  });

  const toggleImportPanel = useCallback(() => {
    if (importPanel.showImportPanel) {
      importPanel.closeImportPanel();
      return;
    }
    forms.closeCharacterForm();
    forms.closeDungeonForm();
    importPanel.openImportPanel();
  }, [forms, importPanel]);

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

  /** One-shot: fills the table from `DungeonList` only while it has no dungeons. */
  const handleAddFromTemplate = useCallback(() => {
    setDungeons((previousDungeons) => {
      if (previousDungeons.length > 0) {
        return previousDungeons;
      }
      return DungeonList.map((templateDungeon) => ({
        ...templateDungeon,
        id: generateUUID(),
      }));
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

  return {
    characters,
    dungeons,
    dungeonToggles,
    storageError,

    ...forms,

    showImportPanel: importPanel.showImportPanel,
    toggleImportPanel,
    closeImportPanel: importPanel.closeImportPanel,

    handleDungeonToggle,
    handleDeleteCharacter,
    handleDeleteDungeon,
    handleAddFromTemplate,
    handleResetAllToggles,
    handleResetCharacterToggles,
    canResetAllToggles,
  };
}

export type RaidTrackerStore = ReturnType<typeof useRaidTracker>;
