import { buildItemIdMap } from "./build-item-id-map.ts";
import itemGearSlotsJson from "./wotlk-item-gear-slots.json";

const itemGearSlotsById = buildItemIdMap(
  itemGearSlotsJson as Record<string, readonly number[]>,
);

/** Valid WowSims gear slot indices for an item id, when known. */
export function getWotlkItemGearSlots(itemId: number): readonly number[] | undefined {
  const slots = itemGearSlotsById.get(itemId);
  return slots && slots.length > 0 ? slots : undefined;
}

export function itemFitsGearSlot(itemId: number, gearSlot: number): boolean {
  const validSlots = getWotlkItemGearSlots(itemId);
  return validSlots?.includes(gearSlot) ?? false;
}
