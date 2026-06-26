import type { ItemTooltipLocale } from "../constants/item-tooltips.ts";
import itemNamesJson from "./wotlk-item-names.json";
import itemNamesRuJson from "./wotlk-item-names-ru.json";

const itemNamesEn = itemNamesJson as Record<string, string>;
const itemNamesRu = itemNamesRuJson as Record<string, string>;

function readName(map: Record<string, string>, itemId: number): string | undefined {
  const name = map[String(itemId)];
  return typeof name === "string" && name.length > 0 ? name : undefined;
}

/** Item display name for the given tooltip locale; falls back EN → other locale → undefined. */
export function getWotlkItemName(
  itemId: number,
  locale: ItemTooltipLocale = "en",
): string | undefined {
  if (locale === "ru") {
    return readName(itemNamesRu, itemId) ?? readName(itemNamesEn, itemId);
  }

  return readName(itemNamesEn, itemId);
}
