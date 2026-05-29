import type { SubmitEvent } from "react";
import type {
  DungeonDifficulty,
  DungeonSize,
} from "../../types/dungeons.ts";

export type DungeonFormProps = {
  name: string;
  size: DungeonSize;
  itemLevelText: string;
  difficulty: DungeonDifficulty;
  error: string;
  onNameChange: (name: string) => void;
  onSizeChange: (size: DungeonSize) => void;
  onItemLevelTextChange: (text: string) => void;
  onDifficultyChange: (difficulty: DungeonDifficulty) => void;
  onCancel: () => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
};
