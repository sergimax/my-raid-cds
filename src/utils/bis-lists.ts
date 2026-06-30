import {
  getBuiltInPresetsForSpec,
  findBuiltInSpecBis,
} from "../data/bis-presets/index.ts";
import { gearSlotLabel } from "../data/gear-slot-names.ts";
import { getWotlkItemGearSlots } from "../data/wotlk-item-gear-slots.ts";
import { getWotlkItemName } from "../data/wotlk-item-names.ts";
import {
  canEquipItemForCharacter,
  type CharacterEquipContext,
} from "./item-equip-restrictions.ts";
import itemNamesJson from "../data/wotlk-item-names.json";
import type { ClassName } from "../types/characters.ts";
import type {
  BisListPreset,
  BisListSlot,
  LocalBisListsState,
  LocalSpecBisEntry,
} from "../types/bis-lists.ts";

const itemNames = itemNamesJson as Record<string, string>;

export type BisSlotValidationMode = "partial" | "strict";

let bisItemNameToIdCache: Map<string, number> | undefined;

function getBisItemNameToIdMap(): Map<string, number> {
  if (!bisItemNameToIdCache) {
    bisItemNameToIdCache = new Map();
    for (const [itemId, itemName] of Object.entries(itemNames)) {
      bisItemNameToIdCache.set(itemName.trim().toLowerCase(), Number(itemId));
    }
  }
  return bisItemNameToIdCache;
}

function resolveBisSegmentItemId(
  rawSegment: string,
  nameToId: Map<string, number>,
): number | "unknown" | undefined {
  const trimmedSegment = rawSegment.trim();
  if (!trimmedSegment) {
    return undefined;
  }

  const parsedItemId = parseBisSlotItemId(trimmedSegment);
  if (parsedItemId !== undefined) {
    return parsedItemId;
  }

  const itemId = nameToId.get(trimmedSegment.toLowerCase());
  return itemId ?? "unknown";
}

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

export function isLocalBisPreset(preset: BisListPreset): boolean {
  return preset.id.startsWith("local-");
}

export function resolveSaveLocalPresetByName(
  localPresets: readonly BisListPreset[],
  builtInPresets: readonly BisListPreset[],
  name: string,
  slots: BisListSlot[],
): { preset: BisListPreset; presets: BisListPreset[] } | { error: string } {
  const trimmedName = name.trim();
  if (!trimmedName) {
    return { error: "List name is required" };
  }

  const normalizedName = trimmedName.toLowerCase();
  const builtInNameMatch = builtInPresets.some(
    (preset) => preset.name.toLowerCase() === normalizedName,
  );
  if (builtInNameMatch) {
    return { error: "Use a custom name (not a built-in list name)" };
  }

  const existingPreset = localPresets.find(
    (preset) => preset.name.toLowerCase() === normalizedName,
  );

  if (existingPreset) {
    const preset: BisListPreset = { ...existingPreset, slots };
    return {
      preset,
      presets: localPresets.map((entry) =>
        entry.id === existingPreset.id ? preset : entry,
      ),
    };
  }

  const preset: BisListPreset = {
    id: `local-${Date.now()}`,
    name: trimmedName,
    slots,
  };

  return {
    preset,
    presets: [...localPresets, preset],
  };
}

export function formatBisSlotItems(itemIds: readonly number[]): string {
  if (itemIds.length === 0) {
    return "—";
  }

  return itemIds
    .map((itemId) => getWotlkItemName(itemId) ?? `#${itemId}`)
    .join(" / ");
}

/** Parses `#51312` or `51312` as a WotLK item id reference. */
export function parseBisSlotItemId(rawSegment: string): number | undefined {
  const trimmedSegment = rawSegment.trim();
  if (!trimmedSegment) {
    return undefined;
  }

  const hashMatch = trimmedSegment.match(/^#(\d+)$/);
  if (hashMatch) {
    return Number(hashMatch[1]);
  }

  if (/^\d+$/.test(trimmedSegment)) {
    return Number(trimmedSegment);
  }

  return undefined;
}

export function validateBisSlotItemsText(
  gearSlot: number,
  itemsText: string,
  mode: BisSlotValidationMode = "strict",
  equipContext: CharacterEquipContext = {},
): { itemIds: number[]; error?: string } {
  const trimmedText = itemsText.trim();
  if (!trimmedText || trimmedText === "—") {
    return { itemIds: [] };
  }

  const nameToId = getBisItemNameToIdMap();
  const itemIds: number[] = [];
  const errors: string[] = [];

  for (const rawSegment of itemsText.split("/")) {
    const segmentResult = resolveBisSegmentItemId(rawSegment, nameToId);
    if (segmentResult === undefined) {
      continue;
    }

    if (segmentResult === "unknown") {
      const trimmedSegment = rawSegment.trim();
      if (mode === "strict" && trimmedSegment) {
        errors.push(`Unknown item: ${trimmedSegment}`);
      }
      continue;
    }

    const itemId = segmentResult;
    const hasName = getWotlkItemName(itemId) !== undefined;
    const validSlots = getWotlkItemGearSlots(itemId);

    if (!hasName && !validSlots) {
      errors.push(`Unknown item id: ${itemId}`);
      continue;
    }

    if (validSlots && !validSlots.includes(gearSlot)) {
      const itemLabel = getWotlkItemName(itemId) ?? `#${itemId}`;
      const validSlotLabels = validSlots.map(gearSlotLabel).join(" or ");
      errors.push(
        `"${itemLabel}" belongs in ${validSlotLabels}, not ${gearSlotLabel(gearSlot)}`,
      );
      continue;
    }

    if (
      equipContext.className &&
      !canEquipItemForCharacter(itemId, gearSlot, equipContext)
    ) {
      const itemLabel = getWotlkItemName(itemId) ?? `#${itemId}`;
      const classLabel = equipContext.className;
      const specLabel = equipContext.spec ? ` (${equipContext.spec})` : "";
      errors.push(`"${itemLabel}" is not usable by ${classLabel}${specLabel}`);
      continue;
    }

    itemIds.push(itemId);
  }

  return {
    itemIds,
    error: errors.length > 0 ? errors.join("; ") : undefined,
  };
}

export function confirmBisSlotItemsText(
  gearSlot: number,
  itemsText: string,
  equipContext: CharacterEquipContext = {},
): { ok: true; itemsText: string; itemIds: number[] } | { ok: false; error: string } {
  const validated = validateBisSlotItemsText(gearSlot, itemsText, "strict", equipContext);
  if (validated.error) {
    return { ok: false, error: validated.error };
  }

  const formattedItemsText =
    validated.itemIds.length > 0 ? formatBisSlotItems(validated.itemIds) : "";

  return {
    ok: true,
    itemsText: formattedItemsText,
    itemIds: validated.itemIds,
  };
}

export function confirmedSlotDraftsToPresetSlots(
  slotDrafts: readonly { slot: number; confirmedText: string }[],
): BisListSlot[] {
  const slots: BisListSlot[] = [];

  for (const slotDraft of slotDrafts) {
    const validated = validateBisSlotItemsText(
      slotDraft.slot,
      slotDraft.confirmedText,
      "strict",
    );
    if (!validated.error && validated.itemIds.length > 0) {
      slots.push({ slot: slotDraft.slot, itemIds: validated.itemIds });
    }
  }

  return slots;
}

export function resolveItemNamesToIds(itemsText: string): {
  itemIds: number[];
  unknownNames: string[];
} {
  const nameToId = getBisItemNameToIdMap();
  const itemIds: number[] = [];
  const unknownNames: string[] = [];

  for (const rawSegment of itemsText.split("/")) {
    const segmentResult = resolveBisSegmentItemId(rawSegment, nameToId);
    if (segmentResult === undefined) {
      continue;
    }

    if (segmentResult === "unknown") {
      unknownNames.push(rawSegment.trim());
      continue;
    }

    itemIds.push(segmentResult);
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
