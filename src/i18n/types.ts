import type { ItemTooltipLocale } from "../constants/item-tooltips.ts";

/** App-wide UI locale (also drives item tooltips). */
export type AppLocale = ItemTooltipLocale;

export type TranslationParams = Record<string, string | number>;
