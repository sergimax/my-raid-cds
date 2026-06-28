import itemNamesJson from "./wotlk-item-names.json";
import itemGearSlotsJson from "./wotlk-item-gear-slots.json";
import { getWotlkItemGearSlots } from "./wotlk-item-gear-slots.ts";
import { getWotlkItemName } from "./wotlk-item-names.ts";

const itemNamesEn = itemNamesJson as Record<string, string>;
const itemGearSlots = itemGearSlotsJson as Record<string, readonly number[]>;

function variantGroupKey(gearSlot: number, englishName: string): string {
  return `${gearSlot}:${englishName}`;
}

function buildVariantIdsByGroupKey(): Map<string, number[]> {
  const variantIdsByGroupKey = new Map<string, number[]>();

  for (const [itemIdStr, englishName] of Object.entries(itemNamesEn)) {
    if (!englishName) {
      continue;
    }

    const gearSlots = itemGearSlots[itemIdStr];
    if (!gearSlots || gearSlots.length === 0) {
      continue;
    }

    const itemId = Number(itemIdStr);
    for (const gearSlot of gearSlots) {
      const groupKey = variantGroupKey(gearSlot, englishName);
      const existingIds = variantIdsByGroupKey.get(groupKey);
      if (existingIds) {
        existingIds.push(itemId);
      } else {
        variantIdsByGroupKey.set(groupKey, [itemId]);
      }
    }
  }

  return variantIdsByGroupKey;
}

const variantIdsByGroupKey = buildVariantIdsByGroupKey();

/** Same English name + gear slot (e.g. ICC normal/heroic Astrylian's belt). */
export function getNameVariantItemIdsAtSlot(
  itemId: number,
  gearSlot: number,
): readonly number[] {
  const englishName = getWotlkItemName(itemId, "en");
  if (!englishName || !getWotlkItemGearSlots(itemId)?.includes(gearSlot)) {
    return [itemId];
  }

  return variantIdsByGroupKey.get(variantGroupKey(gearSlot, englishName)) ?? [itemId];
}

export function expandItemIdsWithNameVariantsAtSlot(
  itemIds: readonly number[],
  gearSlot: number,
): number[] {
  const expandedIds = new Set<number>();

  for (const itemId of itemIds) {
    for (const variantId of getNameVariantItemIdsAtSlot(itemId, gearSlot)) {
      expandedIds.add(variantId);
    }
  }

  return [...expandedIds];
}

/** Name variants for a slot that are not on the BiS list (e.g. ICC normal vs heroic id). */
export function getNonListNameVariantItemIdsAtSlot(
  bisItemIds: readonly number[],
  gearSlot: number,
): number[] {
  const bisItemIdSet = new Set(bisItemIds);
  return expandItemIdsWithNameVariantsAtSlot(bisItemIds, gearSlot).filter(
    (itemId) => !bisItemIdSet.has(itemId),
  );
}

export function isItemIdOrNameVariantAtSlot(
  itemId: number,
  targetItemIds: readonly number[],
  gearSlot: number,
): boolean {
  if (targetItemIds.includes(itemId)) {
    return true;
  }

  return targetItemIds.some((targetItemId) =>
    getNameVariantItemIdsAtSlot(targetItemId, gearSlot).includes(itemId),
  );
}
