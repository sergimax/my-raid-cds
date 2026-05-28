import type { DungeonRecord } from "../../types/dungeons.ts";
import { STATIC_COLUMNS } from "./table-layout.ts";

export function formatDungeonCell(
  dungeon: DungeonRecord,
  columnKey: (typeof STATIC_COLUMNS)[number]["key"],
): string {
  return String(dungeon[columnKey]);
}

