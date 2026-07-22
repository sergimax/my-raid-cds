export const ITEM_TOOLTIP_LOCALE_STORAGE_KEY = "my-raid-cds-item-tooltip-locale";

export type ItemTooltipLocale = "en" | "ru";

export const ITEM_TOOLTIP_LOCALES: readonly ItemTooltipLocale[] = ["en", "ru"];

/** First-visit / missing-storage default (UI + item tooltips). */
export const DEFAULT_ITEM_TOOLTIP_LOCALE: ItemTooltipLocale = "ru";

export const COT_TOOLTIP_SCRIPT_URL = "https://cdn.cavernoftime.com/api/tooltip.js";
export const WOWROAD_TOOLTIP_SCRIPT_URL = "https://wowroad.info/power.js";

export const COT_TOOLTIP_SCRIPT_ID = "my-raid-cds-cot-tooltips";
export const WOWROAD_TOOLTIP_SCRIPT_ID = "my-raid-cds-wowroad-tooltips";
export const WOWROAD_TOOLTIP_CONFIG_SCRIPT_ID = "my-raid-cds-wowroad-tooltips-config";
