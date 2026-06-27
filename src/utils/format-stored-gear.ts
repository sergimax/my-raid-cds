import type { AppLocale } from "../i18n/types.ts";
import { getLocalizedGearSlotLabel } from "../i18n/localized-domain.ts";
import { createTranslator } from "../i18n/translate.ts";
import { getWotlkItemLevel } from "../data/wotlk-item-levels.ts";
import { getWotlkItemName } from "../data/wotlk-item-names.ts";
import type { CharacterGearItem } from "../types/character-gear.ts";
import { summarizeGearItemLevels } from "./summarize-gear-item-levels.ts";

export function formatStoredGearItemLevelLabel(
  item: CharacterGearItem,
  locale: AppLocale = "en",
): string {
  const t = createTranslator(locale);
  const itemLevel = getWotlkItemLevel(item.id);
  return itemLevel === undefined
    ? t("storedGear.ilvlUnknown")
    : t("storedGear.ilvl", { ilvl: itemLevel });
}

export function formatStoredGearItemLine(
  item: CharacterGearItem,
  locale: AppLocale = "en",
): string {
  const itemName = getWotlkItemName(item.id, locale);
  const nameSegment = itemName ?? String(item.id);
  return `${getLocalizedGearSlotLabel(item.slot, locale)} · ${nameSegment} · ${formatStoredGearItemLevelLabel(item, locale)}`;
}

export function formatGearSummary(
  gearItems: CharacterGearItem[],
  locale: AppLocale = "en",
): string {
  const t = createTranslator(locale);
  const summary = summarizeGearItemLevels(gearItems);
  const parts = [t("storedGear.itemCount", { count: summary.equippedCount })];
  if (summary.averageItemLevel !== undefined) {
    parts.push(t("storedGear.avgIlvl", { ilvl: summary.averageItemLevel }));
  }
  if (summary.unknownItemIds.length > 0) {
    parts.push(t("storedGear.unknownIds", { count: summary.unknownItemIds.length }));
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
