import type { CharacterRecord } from "../../types/characters.ts";
import type { DungeonRecord } from "../../types/dungeons.ts";

export type CompletionSummaryData = {
  perCharacter: Array<{
    character: CharacterRecord;
    completedCount: number;
  }>;
  perDungeon: Array<{
    dungeon: DungeonRecord;
    completedCount: number;
  }>;
  totalCells: number;
  totalCompleted: number;
};

export type CompletionSummaryProps = {
  summary: CompletionSummaryData;
  characterCount: number;
  dungeonCount: number;
};
