import type { AppLocale, TranslationParams } from "./types.ts";
import { enMessages, type Messages } from "./messages/en.ts";
import { ruMessages } from "./messages/ru.ts";

type MessageTree = typeof enMessages;

type NestedKeyOf<T, Prefix extends string = ""> = T extends string
  ? Prefix extends ""
    ? never
    : Prefix
  : {
      [K in keyof T & string]: NestedKeyOf<
        T[K],
        Prefix extends "" ? K : `${Prefix}.${K}`
      >;
    }[keyof T & string];

export type MessageKey = NestedKeyOf<MessageTree>;

const catalogs: Record<AppLocale, Messages> = {
  en: enMessages,
  ru: ruMessages,
};

function getNestedValue(tree: Messages, key: MessageKey): string {
  const parts = key.split(".");
  let current: unknown = tree;
  for (const part of parts) {
    if (typeof current !== "object" || current === null || !(part in current)) {
      return key;
    }
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string" ? current : key;
}

function interpolate(template: string, params?: TranslationParams): string {
  if (!params) {
    return template;
  }
  return template.replace(/\{\{(\w+)\}\}/g, (_, paramKey: string) => {
    const value = params[paramKey];
    return value !== undefined ? String(value) : `{{${paramKey}}}`;
  });
}

export function translate(
  locale: AppLocale,
  key: MessageKey,
  params?: TranslationParams,
): string {
  const template = getNestedValue(catalogs[locale], key);
  return interpolate(template, params);
}

export function createTranslator(locale: AppLocale) {
  return (key: MessageKey, params?: TranslationParams) =>
    translate(locale, key, params);
}

export type TranslateFn = ReturnType<typeof createTranslator>;
