import {
  DungeonDifficulty,
  type DungeonRecord,
} from "../types/dungeons.ts";

const CYRILLIC_PATTERN = /[\u0400-\u04FF]/;

function usesRussianImportLabel(
  dungeon: Pick<DungeonRecord, "name" | "shortName">,
): boolean {
  const label = dungeon.shortName ?? dungeon.name;
  return CYRILLIC_PATTERN.test(label);
}

/**
 * Import/export label, e.g. `ICC25H`, `ICC25`, `ЦЛК25хм`, `ЦЛК25`.
 * Normal: `{shortName}{size}`; Heroic: `{shortName}{size}H` or `{shortName}{size}хм`.
 */
export function formatDungeonImportLabel(
  dungeon: Pick<DungeonRecord, "name" | "shortName" | "size" | "difficulty">,
): string {
  const name = dungeon.shortName ?? dungeon.name;
  const base = `${name}${dungeon.size}`;
  if (dungeon.difficulty === DungeonDifficulty.NORMAL) {
    return base;
  }
  return usesRussianImportLabel(dungeon) ? `${base}хм` : `${base}H`;
}
