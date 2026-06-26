import itemGearSlotsJson from "./wotlk-item-gear-slots.json";

const itemGearSlots = itemGearSlotsJson as Record<string, readonly number[]>;

/** Valid WowSims gear slot indices for an item id, when known. */
export function getWotlkItemGearSlots(itemId: number): readonly number[] | undefined {
  const slots = itemGearSlots[String(itemId)];
  return Array.isArray(slots) && slots.length > 0 ? slots : undefined;
}

export function itemFitsGearSlot(itemId: number, gearSlot: number): boolean {
  const validSlots = getWotlkItemGearSlots(itemId);
  return validSlots?.includes(gearSlot) ?? false;
}
