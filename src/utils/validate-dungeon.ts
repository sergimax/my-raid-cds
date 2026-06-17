import type { DungeonFormValues } from "../constants/dungeon-form-defaults.ts";
import type { DungeonRecord } from "../types/dungeons.ts";
import { parseItemLevelInput } from "./parse-item-level-input.ts";

export type { DungeonFormValues } from "../constants/dungeon-form-defaults.ts";

export type ParsedDungeonFormFields = {
  name: string;
  size: DungeonRecord["size"];
  itemLevel: number[];
  difficulty: DungeonRecord["difficulty"];
};

export type ParseDungeonFormResult =
  | { ok: true; fields: ParsedDungeonFormFields }
  | { ok: false; error: string };

export function parseDungeonForm(
  values: DungeonFormValues,
): ParseDungeonFormResult {
  const trimmedName = values.name.trim();
  if (!trimmedName) {
    return { ok: false, error: "Enter a dungeon name." };
  }
  const itemLevels = parseItemLevelInput(values.itemLevelText);
  if (itemLevels.length === 0) {
    return {
      ok: false,
      error: "Enter at least one item level (e.g. 200 or range like 200 / 213).",
    };
  }
  return {
    ok: true,
    fields: {
      name: trimmedName,
      size: values.size,
      itemLevel: itemLevels,
      difficulty: values.difficulty,
    },
  };
}
