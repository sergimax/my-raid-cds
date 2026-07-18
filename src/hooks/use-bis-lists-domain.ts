import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ClassName } from "../types/characters.ts";
import type { BisListSlot, LocalBisListsState } from "../types/bis-lists.ts";
import {
  loadLocalBisListsState,
  saveLocalBisListsState,
} from "../storage/bis-lists/index.ts";
import { getBuiltInPresetsForSpec } from "../data/bis-presets/index.ts";
import {
  getLocalPresetsForSpec,
  getMergedPresetsForSpec,
  getSelectedPresetForSpec,
  isLocalBisPreset,
  resolveBisSlotMap,
  resolveSaveLocalPresetByName,
  specBisStorageKey,
  type BisSlotMap,
  upsertLocalSpecEntry,
} from "../utils/bis-lists.ts";

/** Debounce window for BiS localStorage writes (mirror tracker domain). */
export const BIS_LISTS_SAVE_DEBOUNCE_MS = 400;

/**
 * BiS presets domain: built-in + local lists, selection, and slot maps.
 * Mutations must go through functional updates (`applyLocalUpdate` /
 * `setLocalState(prev => …)`) so rapid select/save/delete cannot clobber each other.
 * Persistence is debounced; unmount flushes the latest in-memory state.
 */
export function useBisListsDomain() {
  const [localState, setLocalState] = useState<LocalBisListsState>(() =>
    loadLocalBisListsState(),
  );
  const [storageError, setStorageError] = useState<string | null>(null);
  const localStateRef = useRef(localState);

  useEffect(() => {
    localStateRef.current = localState;
  }, [localState]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      saveLocalBisListsState(localState, (errorMessage) => {
        setStorageError(errorMessage);
      });
    }, BIS_LISTS_SAVE_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [localState]);

  useEffect(() => {
    return () => {
      saveLocalBisListsState(localStateRef.current);
    };
  }, []);

  /** Prefer this over reading `localState` inside mutation callbacks. */
  const applyLocalUpdate = useCallback(
    (updater: (previous: LocalBisListsState) => LocalBisListsState) => {
      setLocalState((previous) => updater(previous));
    },
    [],
  );

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
      applyLocalUpdate((previous) =>
        upsertLocalSpecEntry(previous, className, spec, {
          selectedPresetId: presetId,
          presets: getLocalPresetsForSpec(previous, className, spec),
        }),
      );
    },
    [applyLocalUpdate],
  );

  const savePresetByName = useCallback(
    (
      className: ClassName,
      spec: string,
      name: string,
      slots: BisListSlot[],
    ): { ok: true } | { ok: false; error: string } => {
      let result: { ok: true } | { ok: false; error: string } = { ok: true };

      setLocalState((current) => {
        const resolved = resolveSaveLocalPresetByName(
          getLocalPresetsForSpec(current, className, spec),
          getBuiltInPresetsForSpec(className, spec),
          name,
          slots,
        );
        if ("error" in resolved) {
          result = { ok: false, error: resolved.error };
          return current;
        }

        result = { ok: true };
        return upsertLocalSpecEntry(current, className, spec, {
          selectedPresetId: resolved.preset.id,
          presets: resolved.presets,
        });
      });

      return result;
    },
    [],
  );

  const deleteLocalPreset = useCallback(
    (className: ClassName, spec: string, presetId: string) => {
      if (!presetId.startsWith("local-")) {
        return;
      }

      applyLocalUpdate((previous) => {
        const storageKey = specBisStorageKey(className, spec);
        const existingEntry = previous.entries[storageKey];
        if (!existingEntry) {
          return previous;
        }

        const nextLocalPresets = existingEntry.presets.filter(
          (preset) => preset.id !== presetId,
        );
        const builtInPresets = getBuiltInPresetsForSpec(className, spec);
        const wasSelected = existingEntry.selectedPresetId === presetId;
        const nextSelectedPresetId = wasSelected
          ? (builtInPresets[0]?.id ?? nextLocalPresets[0]?.id ?? "default")
          : existingEntry.selectedPresetId;

        return upsertLocalSpecEntry(previous, className, spec, {
          selectedPresetId: nextSelectedPresetId,
          presets: nextLocalPresets,
        });
      });
    },
    [applyLocalUpdate],
  );

  const updateSelectedLocalPresetSlots = useCallback(
    (className: ClassName, spec: string, slots: BisListSlot[]) => {
      applyLocalUpdate((previous) => {
        const storageKey = specBisStorageKey(className, spec);
        const existingEntry = previous.entries[storageKey];
        if (!existingEntry) {
          return previous;
        }

        const selectedPreset = getSelectedPresetForSpec(
          className,
          spec,
          previous,
        );
        if (!selectedPreset || !isLocalBisPreset(selectedPreset)) {
          return previous;
        }

        const updatedPresets = existingEntry.presets.map((preset) =>
          preset.id === selectedPreset.id ? { ...preset, slots } : preset,
        );

        return upsertLocalSpecEntry(previous, className, spec, {
          selectedPresetId: existingEntry.selectedPresetId,
          presets: updatedPresets,
        });
      });
    },
    [applyLocalUpdate],
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
      storageError,
    }),
    [
      deleteLocalPreset,
      getBisSlotMapForSpec,
      getPresetsForSpec,
      getSelectedPreset,
      savePresetByName,
      selectPreset,
      storageError,
      updateSelectedLocalPresetSlots,
    ],
  );
}

export type BisListsDomain = ReturnType<typeof useBisListsDomain>;
