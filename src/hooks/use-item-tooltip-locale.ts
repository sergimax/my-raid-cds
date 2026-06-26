import { useContext } from "react";
import { ItemTooltipLocaleContext } from "./item-tooltip-locale.ts";

export function useItemTooltipLocale() {
  const context = useContext(ItemTooltipLocaleContext);
  if (!context) {
    throw new Error(
      "useItemTooltipLocale must be used within ItemTooltipLocaleProvider",
    );
  }
  return context;
}
