import type {
  Dungeon,
  DungeonDifficulty,
  DungeonSize,
} from "../types/dungeons.ts";
import { RaidNames, type RaidKey } from "./raid-names.ts";

export type CreateTemplateDungeonOptions = {
  raidKey: RaidKey;
  size: DungeonSize;
  difficulty: DungeonDifficulty;
  itemLevel: number[];
  /** When true, sets `emblem` from raid metadata (template ICC / Ruby Sanctum rows). */
  withEmblem?: boolean;
};

export function createTemplateDungeon({
  raidKey,
  size,
  difficulty,
  itemLevel,
  withEmblem = false,
}: CreateTemplateDungeonOptions): Dungeon {
  const raid = RaidNames[raidKey];
  return {
    name: raid.ru,
    ...(raid.shortRu ? { shortName: raid.shortRu } : {}),
    size,
    itemLevel,
    difficulty,
    ...(withEmblem ? { emblem: raid.emblem } : {}),
  };
}
