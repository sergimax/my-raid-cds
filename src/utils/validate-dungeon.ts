import {
  MAX_DUNGEON_SHORT_NAME_LENGTH,
  type DungeonFormValues,
} from "../constants/dungeon-form-defaults.ts";
import type { DungeonRecord } from "../types/dungeons.ts";
import { defaultShortNameForDungeonName } from "./dungeon-short-name.ts";
import { parseItemLevelInput } from "./parse-item-level-input.ts";

export type { DungeonFormValues } from "../constants/dungeon-form-defaults.ts";

export type ParsedDungeonFormFields = {
  name: string;
  shortName?: string;
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
  const trimmedShortName = values.shortName.trim();
  if (trimmedShortName.length > MAX_DUNGEON_SHORT_NAME_LENGTH) {
    return {
      ok: false,
      error: `Short name must be at most ${MAX_DUNGEON_SHORT_NAME_LENGTH} characters.`,
    };
  }
  const itemLevels = parseItemLevelInput(values.itemLevelText);
  if (itemLevels.length === 0) {
    return {
      ok: false,
      error: "Enter at least one item level (e.g. 200 or range like 200 / 213).",
    };
  }
  const shortName =
    trimmedShortName || defaultShortNameForDungeonName(trimmedName) || undefined;
  return {
    ok: true,
    fields: {
      name: trimmedName,
      ...(shortName ? { shortName } : {}),
      size: values.size,
      itemLevel: itemLevels,
      difficulty: values.difficulty,
    },
  };
}
