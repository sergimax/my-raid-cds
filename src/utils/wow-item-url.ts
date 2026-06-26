import type { ItemTooltipLocale } from "../constants/item-tooltips.ts";

export function buildWowItemUrl(
  itemId: number,
  locale: ItemTooltipLocale,
): string {
  if (locale === "ru") {
    return `https://wowroad.info/?item=${itemId}`;
  }

  return `https://wotlk.cavernoftime.com/item=${itemId}`;
}
