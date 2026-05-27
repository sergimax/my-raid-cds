import type { SxProps, Theme } from "@mui/material";
import { TableCell, TableSortLabel, Tooltip } from "@mui/material";
import type { ReactNode } from "react";
import type { DungeonSortKey, SortDirection } from "../../utils/sort-dungeons.ts";

type SortableHeaderCellProps = {
  label: ReactNode;
  sortKey: DungeonSortKey;
  activeSortKey: DungeonSortKey;
  sortDirection: SortDirection;
  onSort: (sortKey: DungeonSortKey) => void;
  align?: "left" | "center" | "right";
  sortAriaLabel: string;
  sx?: SxProps<Theme>;
};

export function SortableHeaderCell({
  label,
  sortKey,
  activeSortKey,
  sortDirection,
  onSort,
  align = "left",
  sortAriaLabel,
  sx,
}: SortableHeaderCellProps) {
  const isActive = activeSortKey === sortKey;

  return (
    <TableCell
      align={align}
      sortDirection={isActive ? sortDirection : false}
      sx={[
        align === "center"
          ? {
              "& .MuiTableSortLabel-root": {
                marginLeft: "auto",
                marginRight: "auto",
              },
            }
          : {},
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      <Tooltip title={sortAriaLabel}>
        <TableSortLabel
          active={isActive}
          direction={isActive ? sortDirection : "asc"}
          aria-label={sortAriaLabel}
          onClick={() => {
            onSort(sortKey);
          }}
        >
          {label}
        </TableSortLabel>
      </Tooltip>
    </TableCell>
  );
}
