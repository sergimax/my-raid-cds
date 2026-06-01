import { TableCell, TableRow, Typography } from "@mui/material";
import {
  emptyStateMessage,
  type RaidTrackerTableEmptyVariant,
} from "./raid-tracker-table-empty-state.ts";
import {
  raidTrackerTableColumnCount,
  type PinnedColumnDef,
} from "./table-layout.ts";

type RaidTrackerTableEmptyStateProps = {
  variant: RaidTrackerTableEmptyVariant;
  visiblePinnedColumns: ReadonlyArray<PinnedColumnDef>;
  characterCount: number;
};

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
        <Typography
          variant="body2"
          color="text.secondary"
          role="status"
          aria-live="polite"
        >
          {emptyStateMessage(variant)}
        </Typography>
      </TableCell>
    </TableRow>
  );
}
