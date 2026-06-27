import { useMemo } from "react";
import { useItemTooltipLocale } from "../hooks/use-item-tooltip-locale.ts";
import { createTranslator } from "./translate.ts";
import type { AppLocale, TranslationParams } from "./types.ts";
import type { MessageKey, TranslateFn } from "./translate.ts";

export function useTranslation(): {
  locale: AppLocale;
  t: TranslateFn;
} {
  const { locale } = useItemTooltipLocale();
  const t = useMemo(() => createTranslator(locale), [locale]);
  return { locale, t };
}

export type { MessageKey, TranslationParams, AppLocale, TranslateFn };
