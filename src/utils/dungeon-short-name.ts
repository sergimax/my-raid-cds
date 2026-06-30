import { RaidNames } from "../data/raid-names.ts";
import type { AppLocale } from "../i18n/types.ts";
import type { Dungeon } from "../types/dungeons.ts";

type RaidNameEntry = (typeof RaidNames)[keyof typeof RaidNames];

function findRaidByName(name: string): RaidNameEntry | undefined {
  for (const raid of Object.values(RaidNames)) {
    if (raid.ru === name || raid.en === name) {
      return raid;
    }
  }
  return undefined;
}

export function getLocalizedRaidNameSuggestions(locale: AppLocale): string[] {
  return Object.values(RaidNames)
    .map((raid) => (locale === "ru" ? raid.ru : raid.en))
    .sort((left, right) => left.localeCompare(right, locale));
}

export function isKnownRaidName(name: string): boolean {
  return findRaidByName(name) !== undefined;
}

export function defaultShortNameForDungeonName(name: string): string | undefined {
  const raid = findRaidByName(name);
  if (!raid) {
    return undefined;
  }
  if (raid.ru === name) {
    return raid.shortRu;
  }
  return "shortEn" in raid ? raid.shortEn : undefined;
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
