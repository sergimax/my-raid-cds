import type { EmblemKey } from "../assets/emblems/emblem-icons.ts";

export const DungeonDifficulty = {
  NORMAL: "Normal",
  HEROIC: "Heroic",
} as const;

export type DungeonDifficulty = (typeof DungeonDifficulty)[keyof typeof DungeonDifficulty];

export const DungeonSizes = [5, 10, 20, 25, 40] as const;

export type DungeonSize = (typeof DungeonSizes)[number];

export type Dungeon = {
  name: string;
  /** Optional abbreviation; shown in compact table when set. */
  shortName?: string;
  size: DungeonSize;
  itemLevel: Array<number>;
  difficulty: DungeonDifficulty;
  /** WotLK emblem primarily rewarded by this raid (display only). */
  emblem?: EmblemKey;
};

export type DungeonRecord = Dungeon & { id: string };

export type DungeonToggles = Record<string, Record<string, boolean>>;
