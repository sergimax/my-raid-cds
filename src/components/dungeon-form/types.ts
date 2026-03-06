import type { DungeonRecord } from "../../types/dungeons.ts";

export type DungeonFormProps = {
  onSubmit: (dungeon: Omit<DungeonRecord, "id">) => void;
};
