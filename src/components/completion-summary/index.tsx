import { Box, Typography } from "@mui/material";
import type { CompletionSummaryProps } from "./types.ts";
import type { CharacterRecord } from "../../types/characters.ts";
import type { DungeonRecord } from "../../types/dungeons.ts";

export function CompletionSummary({
  summary,
  dungeonCount,
  characterCount,
}: CompletionSummaryProps) {
  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Completion summary
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Total: {summary.totalCompleted} / {summary.totalCells} cells marked
        complete
      </Typography>
      <Typography variant="body2" color="text.secondary">
        By character:{" "}
        {summary.perCharacter
          .map(
            ({ character, completedCount }: { character: CharacterRecord; completedCount: number }) =>
              `${character.name}: ${completedCount}/${dungeonCount}`,
          )
          .join(" · ") || "—"}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        By dungeon:{" "}
        {summary.perDungeon
          .map(
            ({ dungeon, completedCount }: { dungeon: DungeonRecord; completedCount: number }) =>
              `${dungeon.name}: ${completedCount}/${characterCount}`,
          )
          .join(" · ") || "—"}
      </Typography>
    </Box>
  );
}
