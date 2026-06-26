import { useCallback, useMemo, useState } from "react";
import type { ClassName, CharacterRecord } from "../types/characters.ts";
import type { BisListPreset, LocalBisListsState } from "../types/bis-lists.ts";
import {
  loadLocalBisListsState,
  saveLocalBisListsState,
} from "../storage/bis-lists/index.ts";
import {
  getMergedPresetsForSpec,
  getSelectedPresetForSpec,
  removeLocalSpecEntry,
  resolveBisSlotMap,
  specBisStorageKey,
  type BisSlotMap,
  upsertLocalSpecEntry,
} from "../utils/bis-lists.ts";

export function useBisListsDomain() {
  const [localState, setLocalState] = useState<LocalBisListsState>(() =>
    loadLocalBisListsState(),
  );

  const persistState = useCallback((nextState: LocalBisListsState) => {
    setLocalState(nextState);
    saveLocalBisListsState(nextState);
  }, []);

  const getPresetsForSpec = useCallback(
    (className: ClassName, spec: string) =>
      getMergedPresetsForSpec(className, spec, localState),
    [localState],
  );

  const getSelectedPreset = useCallback(
    (className: ClassName, spec: string) =>
      getSelectedPresetForSpec(className, spec, localState),
    [localState],
  );

  const getBisSlotMapForSpec = useCallback(
    (className: ClassName, spec: string): BisSlotMap =>
      resolveBisSlotMap(className, spec, localState),
    [localState],
  );

  const getBisSlotMapForCharacter = useCallback(
    (character: CharacterRecord): BisSlotMap | undefined => {
      const className = character.class?.name;
      const spec = character.mainSpec?.spec;
      if (!className || !spec) {
        return undefined;
      }
      const slotMap = getBisSlotMapForSpec(className, spec);
      return slotMap.size > 0 ? slotMap : undefined;
    },
    [getBisSlotMapForSpec],
  );

  const selectPreset = useCallback(
    (className: ClassName, spec: string, presetId: string) => {
      const storageKey = specBisStorageKey(className, spec);
      const existingEntry = localState.entries[storageKey];
      const presets = getMergedPresetsForSpec(className, spec, localState);

      persistState(
        upsertLocalSpecEntry(localState, className, spec, {
          selectedPresetId: presetId,
          presets: existingEntry?.presets ?? presets.filter((preset) => preset.id.startsWith("local-")),
        }),
      );
    },
    [localState, persistState],
  );

  const saveLocalPreset = useCallback(
    (className: ClassName, spec: string, preset: BisListPreset) => {
      const storageKey = specBisStorageKey(className, spec);
      const existingEntry = localState.entries[storageKey];
      const nextPresets = existingEntry
        ? [
            ...existingEntry.presets.filter((entry) => entry.id !== preset.id),
            preset,
          ]
        : [preset];

      persistState(
        upsertLocalSpecEntry(localState, className, spec, {
          selectedPresetId: preset.id,
          presets: nextPresets,
        }),
      );
    },
    [localState, persistState],
  );

  const duplicatePreset = useCallback(
    (
      className: ClassName,
      spec: string,
      sourcePreset: BisListPreset,
      newName: string,
    ) => {
      const preset: BisListPreset = {
        id: `local-${Date.now()}`,
        name: newName,
        slots: sourcePreset.slots.map((slotEntry) => ({
          slot: slotEntry.slot,
          itemIds: [...slotEntry.itemIds],
        })),
      };
      saveLocalPreset(className, spec, preset);
      return preset;
    },
    [saveLocalPreset],
  );

  const resetSpecToBuiltIn = useCallback(
    (className: ClassName, spec: string) => {
      persistState(removeLocalSpecEntry(localState, className, spec));
    },
    [localState, persistState],
  );

  return useMemo(
    () => ({
      localState,
      getPresetsForSpec,
      getSelectedPreset,
      getBisSlotMapForSpec,
      getBisSlotMapForCharacter,
      selectPreset,
      saveLocalPreset,
      duplicatePreset,
      resetSpecToBuiltIn,
    }),
    [
      duplicatePreset,
      getBisSlotMapForCharacter,
      getBisSlotMapForSpec,
      getPresetsForSpec,
      getSelectedPreset,
      localState,
      resetSpecToBuiltIn,
      saveLocalPreset,
      selectPreset,
    ],
  );
}

export type BisListsDomain = ReturnType<typeof useBisListsDomain>;
