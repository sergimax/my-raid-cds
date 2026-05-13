import type { DungeonRecord } from "./dungeons.ts";

export type DungeonFormProps = {
  onSubmit: (dungeon: Omit<DungeonRecord, "id">) => void;
  existingDungeons: DungeonRecord[];
};
