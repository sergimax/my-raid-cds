import { Box, Typography } from "@mui/material";
import type { CompletionSummaryProps } from "./types.ts";

export function CompletionSummary({
  totalCompleted,
  totalCells,
}: CompletionSummaryProps) {
  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Completion summary
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Total: {totalCompleted} / {totalCells} cells marked complete
      </Typography>
    </Box>
  );
}
