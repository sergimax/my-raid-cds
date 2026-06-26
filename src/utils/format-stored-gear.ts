import { gearSlotLabel } from "../data/gear-slot-names.ts";
import { getWotlkItemLevel } from "../data/wotlk-item-levels.ts";
import { getWotlkItemName } from "../data/wotlk-item-names.ts";
import type { CharacterGearItem } from "../types/character-gear.ts";
import { summarizeGearItemLevels } from "./summarize-gear-item-levels.ts";

export function formatStoredGearItemLevelLabel(item: CharacterGearItem): string {
  const itemLevel = getWotlkItemLevel(item.id);
  return itemLevel === undefined ? "ilvl ?" : `ilvl ${itemLevel}`;
}

export function formatStoredGearItemLine(item: CharacterGearItem): string {
  const itemName = getWotlkItemName(item.id);
  const nameSegment = itemName ?? String(item.id);
  return `${gearSlotLabel(item.slot)} · ${nameSegment} · ${formatStoredGearItemLevelLabel(item)}`;
}

export function formatGearSummary(gearItems: CharacterGearItem[]): string {
  const summary = summarizeGearItemLevels(gearItems);
  const parts = [`${summary.equippedCount} items`];
  if (summary.averageItemLevel !== undefined) {
    parts.push(`avg ilvl ${summary.averageItemLevel}`);
  }
  if (summary.unknownItemIds.length > 0) {
    parts.push(`${summary.unknownItemIds.length} unknown item id(s)`);
  }
  return parts.join(" · ");
}

export function sortGearItemsBySlot(
  gearItems: readonly CharacterGearItem[],
): CharacterGearItem[] {
  return [...gearItems].sort(
    (leftItem, rightItem) => leftItem.slot - rightItem.slot,
  );
}
