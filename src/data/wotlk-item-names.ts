import type { ItemTooltipLocale } from "../constants/item-tooltips.ts";
import { buildItemIdMap } from "./build-item-id-map.ts";
import itemNamesJson from "./wotlk-item-names.json";
import itemNamesRuJson from "./wotlk-item-names-ru.json";

const itemNamesEnById = buildItemIdMap(itemNamesJson as Record<string, string>);
const itemNamesRuById = buildItemIdMap(itemNamesRuJson as Record<string, string>);

function readName(map: Map<number, string>, itemId: number): string | undefined {
  const name = map.get(itemId);
  return typeof name === "string" && name.length > 0 ? name : undefined;
}

/** Item display name for the given tooltip locale; falls back EN → other locale → undefined. */
export function getWotlkItemName(
  itemId: number,
  locale: ItemTooltipLocale = "en",
): string | undefined {
  if (locale === "ru") {
    return readName(itemNamesRuById, itemId) ?? readName(itemNamesEnById, itemId);
  }

  return readName(itemNamesEnById, itemId);
}
