import { ruRaidNameToEn } from "../data/dungeons.ts";

export type Locale = "en" | "ru";

export function displayDungeonName(storedName: string, locale: Locale): string {
  if (locale === "en") {
    return ruRaidNameToEn[storedName] ?? storedName;
  }
  return storedName;
}
