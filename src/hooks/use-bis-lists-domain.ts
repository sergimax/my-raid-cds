import { useCallback, useMemo, useState } from "react";
import type { ClassName } from "../types/characters.ts";
import type { BisListSlot, LocalBisListsState } from "../types/bis-lists.ts";
import {
  loadLocalBisListsState,
  saveLocalBisListsState,
} from "../storage/bis-lists/index.ts";
import { getBuiltInPresetsForSpec } from "../data/bis-presets/index.ts";
import {
  getMergedPresetsForSpec,
  getSelectedPresetForSpec,
  isLocalBisPreset,
  resolveBisSlotMap,
  resolveSaveLocalPresetByName,
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

  /** Rebuild cache when local BiS state changes; reuse Maps across cell evaluations. */
  const bisSlotMapCache = useMemo(() => {
    const cache = new Map<string, BisSlotMap>();
    return {
      get(className: ClassName, spec: string): BisSlotMap {
        const storageKey = specBisStorageKey(className, spec);
        const cached = cache.get(storageKey);
        if (cached) {
          return cached;
        }
        const resolved = resolveBisSlotMap(className, spec, localState);
        cache.set(storageKey, resolved);
        return resolved;
      },
    };
  }, [localState]);

  const getBisSlotMapForSpec = useCallback(
    (className: ClassName, spec: string): BisSlotMap =>
      bisSlotMapCache.get(className, spec),
    [bisSlotMapCache],
  );

  const selectPreset = useCallback(
    (className: ClassName, spec: string, presetId: string) => {
      const storageKey = specBisStorageKey(className, spec);
      const existingEntry = localState.entries[storageKey];
      const localPresets =
        existingEntry?.presets.filter((preset) => isLocalBisPreset(preset)) ?? [];

      persistState(
        upsertLocalSpecEntry(localState, className, spec, {
          selectedPresetId: presetId,
          presets: localPresets,
        }),
      );
    },
    [localState, persistState],
  );

  const savePresetByName = useCallback(
    (
      className: ClassName,
      spec: string,
      name: string,
      slots: BisListSlot[],
    ): { ok: true } | { ok: false; error: string } => {
      const storageKey = specBisStorageKey(className, spec);
      const existingEntry = localState.entries[storageKey];
      const localPresets =
        existingEntry?.presets.filter((preset) => isLocalBisPreset(preset)) ?? [];
      const builtInPresets = getBuiltInPresetsForSpec(className, spec);

      const resolved = resolveSaveLocalPresetByName(
        localPresets,
        builtInPresets,
        name,
        slots,
      );
      if ("error" in resolved) {
        return { ok: false, error: resolved.error };
      }

      persistState(
        upsertLocalSpecEntry(localState, className, spec, {
          selectedPresetId: resolved.preset.id,
          presets: resolved.presets,
        }),
      );

      return { ok: true };
    },
    [localState, persistState],
  );

  const deleteLocalPreset = useCallback(
    (className: ClassName, spec: string, presetId: string) => {
      if (!presetId.startsWith("local-")) {
        return;
      }

      const storageKey = specBisStorageKey(className, spec);
      const existingEntry = localState.entries[storageKey];
      if (!existingEntry) {
        return;
      }

      const nextLocalPresets = existingEntry.presets.filter(
        (preset) => preset.id !== presetId,
      );
      const builtInPresets = getBuiltInPresetsForSpec(className, spec);
      const wasSelected = existingEntry.selectedPresetId === presetId;
      const nextSelectedPresetId = wasSelected
        ? (builtInPresets[0]?.id ?? nextLocalPresets[0]?.id ?? "default")
        : existingEntry.selectedPresetId;

      persistState(
        upsertLocalSpecEntry(localState, className, spec, {
          selectedPresetId: nextSelectedPresetId,
          presets: nextLocalPresets,
        }),
      );
    },
    [localState, persistState],
  );

  const updateSelectedLocalPresetSlots = useCallback(
    (className: ClassName, spec: string, slots: BisListSlot[]) => {
      const storageKey = specBisStorageKey(className, spec);
      const existingEntry = localState.entries[storageKey];
      if (!existingEntry) {
        return;
      }

      const selectedPreset = getSelectedPresetForSpec(className, spec, localState);
      if (!selectedPreset || !isLocalBisPreset(selectedPreset)) {
        return;
      }

      const updatedPresets = existingEntry.presets.map((preset) =>
        preset.id === selectedPreset.id ? { ...preset, slots } : preset,
      );

      persistState(
        upsertLocalSpecEntry(localState, className, spec, {
          selectedPresetId: existingEntry.selectedPresetId,
          presets: updatedPresets,
        }),
      );
    },
    [localState, persistState],
  );

  return useMemo(
    () => ({
      getPresetsForSpec,
      getSelectedPreset,
      getBisSlotMapForSpec,
      selectPreset,
      savePresetByName,
      deleteLocalPreset,
      updateSelectedLocalPresetSlots,
    }),
    [
      deleteLocalPreset,
      getBisSlotMapForSpec,
      getPresetsForSpec,
      getSelectedPreset,
      savePresetByName,
      selectPreset,
      updateSelectedLocalPresetSlots,
    ],
  );
}

export type BisListsDomain = ReturnType<typeof useBisListsDomain>;
