import type { Dungeon } from "../types/dungeons.ts";
import { DungeonMode } from "../types/dungeons.ts";

export const DungeonList: Array<Dungeon> = [
  { name: "Example Dungeon", size: 10, itemLevel: [200], mode: DungeonMode.HEROIC },
];
