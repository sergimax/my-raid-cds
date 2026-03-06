export const DungeonMode = {
  HEROIC: "Heroic",
  NORMAL: "Normal",
} as const;

export type DungeonMode = (typeof DungeonMode)[keyof typeof DungeonMode];

export type Dungeon = {
  name: string;
  size: 10 | 20 | 25 | 40;
  itemLevel: Array<number>;
  mode: DungeonMode;
};

export type DungeonRecord = Dungeon & { id: string };
