import {
  DungeonDifficulty,
  type DungeonRecord,
} from "../types/dungeons.ts";
import type { AppLocale } from "../i18n/types.ts";
import { getLocalizedDungeonDisplayName } from "../i18n/localized-domain.ts";

const CYRILLIC_PATTERN = /[\u0400-\u04FF]/;

function usesRussianExportLabel(
  dungeon: Pick<DungeonRecord, "name" | "shortName" | "raidKey">,
  locale: AppLocale,
): boolean {
  if (locale === "ru") {
    return true;
  }
  const label = getLocalizedDungeonDisplayName(dungeon, locale, true);
  return CYRILLIC_PATTERN.test(label);
}

/**
 * Export label, e.g. `ICC25H`, `ICC25`, `ЦЛК25хм`, `ЦЛК25`.
 * Normal: `{shortName}{size}`; Heroic: `{shortName}{size}H` or `{shortName}{size}хм`.
 */
export function formatDungeonExportLabel(
  dungeon: Pick<DungeonRecord, "name" | "shortName" | "size" | "difficulty" | "raidKey">,
  locale: AppLocale = "en",
): string {
  const name = getLocalizedDungeonDisplayName(dungeon, locale, true);
  const base = `${name}${dungeon.size}`;
  if (dungeon.difficulty === DungeonDifficulty.NORMAL) {
    return base;
  }
  return usesRussianExportLabel(dungeon, locale) ? `${base}хм` : `${base}H`;
}
