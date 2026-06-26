import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ITEM_TOOLTIP_LOCALE_STORAGE_KEY } from "../constants/item-tooltips.ts";
import { hideExternalWowTooltips } from "../utils/hide-external-wow-tooltips.ts";
import {
  getInitialItemTooltipLocale,
  ItemTooltipLocaleContext,
  type ItemTooltipLocaleContextValue,
} from "../hooks/item-tooltip-locale.ts";
import type { ItemTooltipLocale } from "../constants/item-tooltips.ts";

export function ItemTooltipLocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<ItemTooltipLocale>(() =>
    getInitialItemTooltipLocale(),
  );

  useEffect(() => {
    hideExternalWowTooltips();
  }, [locale]);

  useEffect(() => {
    try {
      localStorage.setItem(ITEM_TOOLTIP_LOCALE_STORAGE_KEY, locale);
    } catch {
      // ignore
    }
  }, [locale]);

  const setLocale = useCallback((nextLocale: ItemTooltipLocale) => {
    setLocaleState(nextLocale);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocaleState((previous) => (previous === "en" ? "ru" : "en"));
  }, []);

  const value = useMemo<ItemTooltipLocaleContextValue>(
    () => ({
      locale,
      setLocale,
      toggleLocale,
    }),
    [locale, setLocale, toggleLocale],
  );

  return (
    <ItemTooltipLocaleContext.Provider value={value}>
      {children}
    </ItemTooltipLocaleContext.Provider>
  );
}
