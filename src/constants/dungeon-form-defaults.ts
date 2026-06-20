import {
  DungeonDifficulty,
  type DungeonDifficulty as DungeonDifficultyValue,
  type DungeonSize,
} from "../types/dungeons.ts";

export const MAX_DUNGEON_SHORT_NAME_LENGTH = 12;

export type DungeonFormValues = {
  name: string;
  shortName: string;
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
    shortName: "",
    size: DEFAULT_DUNGEON_FORM_SIZE,
    itemLevelText: DEFAULT_DUNGEON_ITEM_LEVEL_TEXT,
    difficulty: DEFAULT_DUNGEON_DIFFICULTY,
  };
}
