export const DungeonMode = {
  HEROIC: "Heroic",
  NORMAL: "Normal",
} as const;

export type DungeonMode = (typeof DungeonMode)[keyof typeof DungeonMode];

export const DungeonSizes = [10, 20, 25, 40] as const;

export type DungeonSize = (typeof DungeonSizes)[number];

export type Dungeon = {
  name: string;
  size: DungeonSize;
  itemLevel: Array<number>;
  mode: DungeonMode;
};

export type DungeonRecord = Dungeon & { id: string };

export type DungeonToggles = Record<string, Record<string, boolean>>;
