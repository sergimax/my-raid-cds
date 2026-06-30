import type { ItemTooltipLocale } from "../constants/item-tooltips.ts";
import { getWotlkItemName } from "../data/wotlk-item-names.ts";
import tierSetsByItemIdJson from "../data/tier-sets-by-item-id.json";
import {
  dungeonDropsTierSetToken,
  getTierSetTokenName,
  canClassUseTierSetToken,
} from "../data/tier-set-tokens.ts";
import { getTierSetItemEntry, isTierSetGearSlot } from "../data/tier-sets.ts";
import type { ClassName } from "../types/characters.ts";
import type { CharacterGearItem } from "../types/character-gear.ts";
import type { DungeonRecord } from "../types/dungeons.ts";
import type { TierSetHint, TierSetItemEntry, TierSetTokenNeed } from "../types/tier-sets.ts";
import type { BisSlotMap } from "./bis-lists.ts";
import { resolveDungeonRaidKey } from "./resolve-dungeon-raid-key.ts";

const tierSetsByItemId = tierSetsByItemIdJson as Record<string, TierSetItemEntry>;

const setPieceIdsCache = new Map<string, number[]>();

function findSetPieceIds(setName: string, slot: number): readonly number[] {
  const cacheKey = `${setName}|${slot}`;
  const cached = setPieceIdsCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const itemIds: number[] = [];
  for (const [itemIdText, entry] of Object.entries(tierSetsByItemId)) {
    if (entry.setName === setName && entry.slot === slot) {
      itemIds.push(Number(itemIdText));
    }
  }

  setPieceIdsCache.set(cacheKey, itemIds);
  return itemIds;
}

function equippedItemIdForSlot(
  gearItems: readonly CharacterGearItem[],
  slot: number,
): number | undefined {
  return gearItems.find((item) => item.slot === slot)?.id;
}

function currentStepForSlot(
  equippedItemId: number | undefined,
  setName: string,
  slot: number,
): number {
  if (equippedItemId === undefined) {
    return 0;
  }

  const equippedEntry = getTierSetItemEntry(equippedItemId);
  if (
    equippedEntry &&
    equippedEntry.setName === setName &&
    equippedEntry.slot === slot
  ) {
    return equippedEntry.step;
  }

  return 0;
}

function findSetEntryAtStep(
  setName: string,
  slot: number,
  step: number,
): { itemId: number; entry: TierSetItemEntry } | undefined {
  for (const itemId of findSetPieceIds(setName, slot)) {
    const entry = getTierSetItemEntry(itemId);
    if (entry?.step === step) {
      return { itemId, entry };
    }
  }
  return undefined;
}

function isEquippedBisTarget(
  equippedItemId: number | undefined,
  bisItemIds: readonly number[],
): boolean {
  return (
    equippedItemId !== undefined && bisItemIds.includes(equippedItemId)
  );
}

function collectNextTokenNeedForSlot(
  equippedItemId: number | undefined,
  targetItemId: number,
  bisItemIds: readonly number[],
  dungeon: Pick<DungeonRecord, "raidKey" | "name" | "size" | "difficulty">,
  className: ClassName,
): TierSetTokenNeed | null {
  if (isEquippedBisTarget(equippedItemId, bisItemIds)) {
    return null;
  }

  const targetEntry = getTierSetItemEntry(targetItemId);
  if (!targetEntry) {
    return null;
  }

  const currentStep = currentStepForSlot(
    equippedItemId,
    targetEntry.setName,
    targetEntry.slot,
  );

  for (let step = currentStep + 1; step <= targetEntry.step; step += 1) {
    const stepPiece = findSetEntryAtStep(targetEntry.setName, targetEntry.slot, step);
    if (!stepPiece) {
      continue;
    }

    const stepTokenId = stepPiece.entry.tokenItemId;
    const raidKey = resolveDungeonRaidKey(dungeon);
    if (
      stepTokenId === undefined ||
      !raidKey ||
      !dungeonDropsTierSetToken({ ...dungeon, raidKey }, stepTokenId) ||
      !canClassUseTierSetToken(className, stepTokenId)
    ) {
      continue;
    }

    return {
      tokenItemId: stepTokenId,
      slot: targetEntry.slot,
      targetItemId: stepPiece.itemId,
    };
  }

  return null;
}

export function evaluateTierSetHint(
  gearItems: readonly CharacterGearItem[] | undefined,
  dungeon: Pick<DungeonRecord, "raidKey" | "name" | "size" | "difficulty">,
  bisSlotMap: BisSlotMap | undefined,
  className: ClassName,
): TierSetHint {
  if (!bisSlotMap || bisSlotMap.size === 0 || !resolveDungeonRaidKey(dungeon)) {
    return { tokenNeeds: [] };
  }

  const equippedGear = gearItems ?? [];
  const tokenNeeds: TierSetTokenNeed[] = [];

  for (const [slot, bisItemIds] of bisSlotMap) {
    if (!isTierSetGearSlot(slot) || bisItemIds.length === 0) {
      continue;
    }

    const targetItemId = bisItemIds[0];
    if (!getTierSetItemEntry(targetItemId)) {
      continue;
    }

    const equippedItemId = equippedItemIdForSlot(equippedGear, slot);
    const nextTokenNeed = collectNextTokenNeedForSlot(
      equippedItemId,
      targetItemId,
      bisItemIds,
      dungeon,
      className,
    );
    if (nextTokenNeed) {
      tokenNeeds.push(nextTokenNeed);
    }
  }

  return { tokenNeeds };
}

export type AggregatedTierSetTokenNeed = {
  tokenItemId: number;
  count: number;
  slots: number[];
};

export function aggregateTierSetTokenNeeds(
  tokenNeeds: readonly TierSetTokenNeed[],
): AggregatedTierSetTokenNeed[] {
  const byTokenId = new Map<number, AggregatedTierSetTokenNeed>();

  for (const need of tokenNeeds) {
    const existing = byTokenId.get(need.tokenItemId);
    if (existing) {
      existing.count += 1;
      if (!existing.slots.includes(need.slot)) {
        existing.slots.push(need.slot);
      }
      continue;
    }

    byTokenId.set(need.tokenItemId, {
      tokenItemId: need.tokenItemId,
      count: 1,
      slots: [need.slot],
    });
  }

  return [...byTokenId.values()].sort(
    (leftNeed, rightNeed) => leftNeed.tokenItemId - rightNeed.tokenItemId,
  );
}

export function hasTierSetTokenHint(hint: TierSetHint): boolean {
  return hint.tokenNeeds.length > 0;
}

export function formatTierSetTokenLabel(
  tokenItemId: number,
  locale: ItemTooltipLocale,
): string {
  return (
    getWotlkItemName(tokenItemId, locale) ??
    getTierSetTokenName(tokenItemId, locale) ??
    `#${tokenItemId}`
  );
}
