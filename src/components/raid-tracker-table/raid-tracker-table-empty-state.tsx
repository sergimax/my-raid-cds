import { TableCell, TableRow, Typography } from "@mui/material";
import {
  raidTrackerTableColumnCount,
  type PinnedColumnDef,
} from "./table-layout.ts";

export type RaidTrackerTableEmptyVariant = "no-dungeons" | "no-search-matches";

type RaidTrackerTableEmptyStateProps = {
  variant: RaidTrackerTableEmptyVariant;
  visiblePinnedColumns: ReadonlyArray<PinnedColumnDef>;
  characterCount: number;
};

function emptyStateMessage(variant: RaidTrackerTableEmptyVariant): string {
  if (variant === "no-dungeons") {
    return "Add a dungeon or use Add from template to get started.";
  }
  return "No dungeons match your search.";
}

export function RaidTrackerTableEmptyState({
  variant,
  visiblePinnedColumns,
  characterCount,
}: RaidTrackerTableEmptyStateProps) {
  const columnCount = raidTrackerTableColumnCount(
    visiblePinnedColumns,
    characterCount,
  );

  return (
    <TableRow>
      <TableCell colSpan={columnCount} align="center" sx={{ py: 3 }}>
        <Typography variant="body2" color="text.secondary">
          {emptyStateMessage(variant)}
        </Typography>
      </TableCell>
    </TableRow>
  );
}
