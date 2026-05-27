import type { SxProps, Theme } from "@mui/material";
import { Stack, TableCell, TableSortLabel, TextField } from "@mui/material";
import type { DungeonSortKey, SortDirection } from "../../utils/sort-dungeons.ts";

type DungeonNameHeaderCellProps = {
  activeSortKey: DungeonSortKey;
  sortDirection: SortDirection;
  onSort: (sortKey: DungeonSortKey) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  sx?: SxProps<Theme>;
};

export function DungeonNameHeaderCell({
  activeSortKey,
  sortDirection,
  onSort,
  searchQuery,
  onSearchQueryChange,
  sx,
}: DungeonNameHeaderCellProps) {
  const isActive = activeSortKey === "name";

  return (
    <TableCell
      sortDirection={isActive ? sortDirection : false}
      sx={sx}
      className="raid-tracker-table__dungeon-name-header"
    >
      <Stack spacing={0.5}>
        <TableSortLabel
          active={isActive}
          direction={isActive ? sortDirection : "asc"}
          onClick={() => {
            onSort("name");
          }}
        >
          Dungeon name
        </TableSortLabel>
        <TextField
          className="raid-tracker-table__dungeon-search"
          size="small"
          placeholder="Search…"
          value={searchQuery}
          onChange={(event) => {
            onSearchQueryChange(event.target.value);
          }}
          onClick={(event) => {
            event.stopPropagation();
          }}
          onKeyDown={(event) => {
            event.stopPropagation();
          }}
          slotProps={{
            htmlInput: {
              "aria-label": "Filter by dungeon name",
            },
          }}
          fullWidth
        />
      </Stack>
    </TableCell>
  );
}
