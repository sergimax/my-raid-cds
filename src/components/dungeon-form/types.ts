import type { SubmitEvent } from "react";
import type {
  DungeonDifficulty,
  DungeonSize,
} from "../../types/dungeons.ts";

export type DungeonFormProps = {
  name: string;
  shortName: string;
  size: DungeonSize;
  itemLevelText: string;
  difficulty: DungeonDifficulty;
  error: string;
  onNameChange: (name: string) => void;
  onShortNameChange: (shortName: string) => void;
  onSizeChange: (size: DungeonSize) => void;
  onItemLevelTextChange: (text: string) => void;
  onDifficultyChange: (difficulty: DungeonDifficulty) => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
};
