import {
  getBuiltInPresetsForSpec,
  findBuiltInSpecBis,
} from "../data/bis-presets/index.ts";
import { getWotlkItemName } from "../data/wotlk-item-names.ts";
import itemNamesJson from "../data/wotlk-item-names.json";
import { gearSlotLabel } from "../data/gear-slot-names.ts";
import type { ClassName } from "../types/characters.ts";
import type {
  BisListPreset,
  BisListSlot,
  LocalBisListsState,
  LocalSpecBisEntry,
} from "../types/bis-lists.ts";

const itemNames = itemNamesJson as Record<string, string>;

export type BisSlotMap = ReadonlyMap<number, readonly number[]>;

export function specBisStorageKey(className: ClassName, spec: string): string {
  return `${className}|${spec}`;
}

export function getMergedPresetsForSpec(
  className: ClassName,
  spec: string,
  localState: LocalBisListsState,
): BisListPreset[] {
  const storageKey = specBisStorageKey(className, spec);
  const localEntry = localState.entries[storageKey];
  const builtInPresets = [...getBuiltInPresetsForSpec(className, spec)];

  if (!localEntry) {
    return builtInPresets;
  }

  const builtInIds = new Set(builtInPresets.map((preset) => preset.id));
  const localOnlyPresets = localEntry.presets.filter(
    (preset) => !builtInIds.has(preset.id),
  );

  return [...builtInPresets, ...localOnlyPresets];
}

export function getSelectedPresetForSpec(
  className: ClassName,
  spec: string,
  localState: LocalBisListsState,
): BisListPreset | undefined {
  const presets = getMergedPresetsForSpec(className, spec, localState);
  if (presets.length === 0) {
    return undefined;
  }

  const storageKey = specBisStorageKey(className, spec);
  const selectedPresetId = localState.entries[storageKey]?.selectedPresetId;
  return (
    presets.find((preset) => preset.id === selectedPresetId) ??
    presets[0]
  );
}

export function buildBisSlotMap(preset: BisListPreset | undefined): BisSlotMap {
  const slotMap = new Map<number, readonly number[]>();
  if (!preset) {
    return slotMap;
  }

  for (const slotEntry of preset.slots) {
    const existing = slotMap.get(slotEntry.slot) ?? [];
    slotMap.set(slotEntry.slot, [...new Set([...existing, ...slotEntry.itemIds])]);
  }

  return slotMap;
}

export function resolveBisSlotMap(
  className: ClassName,
  spec: string,
  localState: LocalBisListsState,
): BisSlotMap {
  return buildBisSlotMap(getSelectedPresetForSpec(className, spec, localState));
}

export function hasBuiltInBisForSpec(className: ClassName, spec: string): boolean {
  return findBuiltInSpecBis(className, spec) !== undefined;
}

export function formatBisSlotItems(itemIds: readonly number[]): string {
  if (itemIds.length === 0) {
    return "—";
  }

  return itemIds
    .map((itemId) => getWotlkItemName(itemId) ?? `#${itemId}`)
    .join(" / ");
}

export function formatBisSlotLine(slotEntry: BisListSlot): string {
  return `${gearSlotLabel(slotEntry.slot)}: ${formatBisSlotItems(slotEntry.itemIds)}`;
}

export function resolveItemNamesToIds(namesText: string): {
  itemIds: number[];
  unknownNames: string[];
} {
  const nameToId = new Map<string, number>();
  for (const [itemId, itemName] of Object.entries(itemNames)) {
    nameToId.set(itemName.trim().toLowerCase(), Number(itemId));
  }

  const itemIds: number[] = [];
  const unknownNames: string[] = [];

  for (const rawName of namesText.split("/")) {
    const trimmedName = rawName.trim();
    if (!trimmedName) {
      continue;
    }

    const itemId = nameToId.get(trimmedName.toLowerCase());
    if (itemId === undefined) {
      unknownNames.push(trimmedName);
    } else {
      itemIds.push(itemId);
    }
  }

  return { itemIds, unknownNames };
}

export function upsertLocalSpecEntry(
  localState: LocalBisListsState,
  className: ClassName,
  spec: string,
  entry: LocalSpecBisEntry,
): LocalBisListsState {
  const storageKey = specBisStorageKey(className, spec);
  return {
    ...localState,
    entries: {
      ...localState.entries,
      [storageKey]: entry,
    },
  };
}

export function removeLocalSpecEntry(
  localState: LocalBisListsState,
  className: ClassName,
  spec: string,
): LocalBisListsState {
  const storageKey = specBisStorageKey(className, spec);
  const nextEntries = { ...localState.entries };
  delete nextEntries[storageKey];
  return {
    ...localState,
    entries: nextEntries,
  };
}
