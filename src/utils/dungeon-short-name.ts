import { RaidNames } from "../data/raid-names.ts";
import type { AppLocale } from "../i18n/types.ts";
import type { Dungeon } from "../types/dungeons.ts";

export function getLocalizedRaidNameSuggestions(locale: AppLocale): string[] {
  return Object.values(RaidNames)
    .map((raid) => (locale === "ru" ? raid.ru : raid.en))
    .sort((left, right) => left.localeCompare(right, locale));
}

export function isKnownRaidName(name: string): boolean {
  for (const raid of Object.values(RaidNames)) {
    if (raid.ru === name || raid.en === name) {
      return true;
    }
  }
  return false;
}

export function defaultShortNameForDungeonName(name: string): string | undefined {
  for (const raid of Object.values(RaidNames)) {
    if (raid.ru === name) {
      return raid.shortRu;
    }
    if ("shortEn" in raid && raid.en === name) {
      return raid.shortEn;
    }
  }
  return undefined;
}

export function getDungeonDisplayName(
  dungeon: Pick<Dungeon, "name" | "shortName">,
  compact: boolean,
): string {
  if (compact && dungeon.shortName) {
    return dungeon.shortName;
  }
  return dungeon.name;
}
