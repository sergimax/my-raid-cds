import { TableCell, TableSortLabel } from "@mui/material";
import type { DungeonSortKey, SortDirection } from "../../utils/sort-dungeons.ts";

type SortableHeaderCellProps = {
  label: string;
  sortKey: DungeonSortKey;
  activeSortKey: DungeonSortKey;
  sortDirection: SortDirection;
  onSort: (sortKey: DungeonSortKey) => void;
  align?: "left" | "center" | "right";
};

export function SortableHeaderCell({
  label,
  sortKey,
  activeSortKey,
  sortDirection,
  onSort,
  align = "left",
}: SortableHeaderCellProps) {
  const isActive = activeSortKey === sortKey;

  return (
    <TableCell align={align} sortDirection={isActive ? sortDirection : false}>
      <TableSortLabel
        active={isActive}
        direction={isActive ? sortDirection : "asc"}
        onClick={() => {
          onSort(sortKey);
        }}
      >
        {label}
      </TableSortLabel>
    </TableCell>
  );
}
