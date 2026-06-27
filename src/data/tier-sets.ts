import tierSetsByItemIdJson from "./tier-sets-by-item-id.json";
import type { TierSetItemEntry, TierSetTier } from "../types/tier-sets.ts";

const tierSetsByItemId = tierSetsByItemIdJson as Record<string, TierSetItemEntry>;

/** Gear slots used by WotLK PvE tier sets (head, shoulder, chest, hands, legs). */
export const TIER_SET_GEAR_SLOTS = [0, 2, 4, 6, 8, 10] as const;

export function isTierSetGearSlot(slot: number): boolean {
  return (TIER_SET_GEAR_SLOTS as readonly number[]).includes(slot);
}

export function getTierSetItemEntry(itemId: number): TierSetItemEntry | undefined {
  return tierSetsByItemId[String(itemId)];
}

export function findTierSetPieceAtStep(
  setName: string,
  slot: number,
  step: 1 | 2 | 3,
): TierSetItemEntry | undefined {
  for (const entry of Object.values(tierSetsByItemId)) {
    if (entry.setName === setName && entry.slot === slot && entry.step === step) {
      return entry;
    }
  }
  return undefined;
}

export function findTierSetPieceItemIdAtStep(
  setName: string,
  slot: number,
  step: 1 | 2 | 3,
): number | undefined {
  for (const [itemId, entry] of Object.entries(tierSetsByItemId)) {
    if (entry.setName === setName && entry.slot === slot && entry.step === step) {
      return Number(itemId);
    }
  }
  return undefined;
}

export function tierLabel(tier: TierSetTier): string {
  switch (tier) {
    case "t8":
      return "T8";
    case "t9":
      return "T9";
    case "t10":
      return "T10";
  }
}
