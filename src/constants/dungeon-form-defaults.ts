import {
  DungeonDifficulty,
  type DungeonDifficulty as DungeonDifficultyValue,
  type DungeonSize,
} from "../types/dungeons.ts";

export type DungeonFormValues = {
  name: string;
  size: DungeonSize;
  itemLevelText: string;
  difficulty: DungeonDifficultyValue;
};

export const DEFAULT_DUNGEON_FORM_SIZE: DungeonSize = 10;
export const DEFAULT_DUNGEON_ITEM_LEVEL_TEXT = "200";
export const DEFAULT_DUNGEON_DIFFICULTY: DungeonDifficultyValue =
  DungeonDifficulty.NORMAL;

export function defaultDungeonFormValues(): DungeonFormValues {
  return {
    name: "",
    size: DEFAULT_DUNGEON_FORM_SIZE,
    itemLevelText: DEFAULT_DUNGEON_ITEM_LEVEL_TEXT,
    difficulty: DEFAULT_DUNGEON_DIFFICULTY,
  };
}
