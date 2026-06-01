import {
  DungeonDifficulty,
  type DungeonDifficulty as DungeonDifficultyValue,
  type DungeonSize,
} from "../types/dungeons.ts";
import { parseItemLevelInput } from "./parse-item-level-input.ts";

export type DungeonFormValues = {
  name: string;
  size: DungeonSize;
  itemLevelText: string;
  difficulty: DungeonDifficultyValue;
};

export type ParsedDungeonFormFields = {
  name: string;
  size: DungeonSize;
  itemLevel: number[];
  difficulty: DungeonDifficultyValue;
};

export type ParseDungeonFormResult =
  | { ok: true; fields: ParsedDungeonFormFields }
  | { ok: false; error: string };

export const DEFAULT_DUNGEON_FORM_SIZE: DungeonSize = 10;
export const DEFAULT_DUNGEON_ITEM_LEVEL_TEXT = "200";
export const DEFAULT_DUNGEON_DIFFICULTY: DungeonDifficultyValue =
  DungeonDifficulty.NORMAL;

export function parseDungeonForm(values: DungeonFormValues): ParseDungeonFormResult {
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

export function defaultDungeonFormValues(): DungeonFormValues {
  return {
    name: "",
    size: DEFAULT_DUNGEON_FORM_SIZE,
    itemLevelText: DEFAULT_DUNGEON_ITEM_LEVEL_TEXT,
    difficulty: DEFAULT_DUNGEON_DIFFICULTY,
  };
}
