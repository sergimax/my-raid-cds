import { createContext } from "react";
import {
  ITEM_TOOLTIP_LOCALE_STORAGE_KEY,
  ITEM_TOOLTIP_LOCALES,
  type ItemTooltipLocale,
} from "../constants/item-tooltips.ts";

export type ItemTooltipLocaleContextValue = {
  locale: ItemTooltipLocale;
  setLocale: (locale: ItemTooltipLocale) => void;
  toggleLocale: () => void;
};

export const ItemTooltipLocaleContext =
  createContext<ItemTooltipLocaleContextValue | null>(null);

function readStoredItemTooltipLocale(): ItemTooltipLocale | null {
  try {
    const raw = localStorage.getItem(ITEM_TOOLTIP_LOCALE_STORAGE_KEY);
    if (raw && ITEM_TOOLTIP_LOCALES.includes(raw as ItemTooltipLocale)) {
      return raw as ItemTooltipLocale;
    }
  } catch {
    // ignore quota / private mode
  }
  return null;
}

export function getInitialItemTooltipLocale(): ItemTooltipLocale {
  return readStoredItemTooltipLocale() ?? "en";
}
