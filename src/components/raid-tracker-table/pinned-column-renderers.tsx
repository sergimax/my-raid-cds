/**
 * Single registry for pinned (sticky) columns: maps each column key to its
 * header and body cell content so head and body rows stay in sync.
 */
import SportsScoreIcon from "@mui/icons-material/SportsScore";
import type { ReactNode } from "react";
import type { DungeonRecord } from "../../types/dungeons.ts";
import type { DungeonSortKey, SortDirection } from "../../utils/sort-dungeons.ts";
import {
  CompletionCountChip,
  DungeonNameCell,
  DungeonTypeCell,
  ItemLevelCell,
} from "./dungeon-cells.tsx";
import { DungeonNameHeaderCell } from "./dungeon-name-header-cell.tsx";
import { SortableHeaderCell } from "./sortable-header-cell.tsx";
import {
  pinnedBodySxForColumn,
  pinnedHeaderSxForColumn,
  type PinnedColumnDef,
  type PinnedColumnKey,
} from "./table-layout.ts";

export type PinnedColumnHeaderContext = {
  column: PinnedColumnDef;
  compactTable: boolean;
  sortKey: DungeonSortKey;
  sortDirection: SortDirection;
  onSort: (sortKey: DungeonSortKey) => void;
  dungeonNameSearch: string;
  onDungeonNameSearchChange: (query: string) => void;
};

export type PinnedColumnBodyContext = {
  column: PinnedColumnDef;
  compactTable: boolean;
  dungeon: DungeonRecord;
  completionsByDungeonId: Readonly<Record<string, number>>;
  characterCount: number;
};

function renderPinnedHeader(
  columnKey: PinnedColumnKey,
  context: PinnedColumnHeaderContext,
): ReactNode {
  const {
    column,
    compactTable,
    sortKey,
    sortDirection,
    onSort,
    dungeonNameSearch,
    onDungeonNameSearchChange,
  } = context;
  const headerSx = pinnedHeaderSxForColumn(columnKey, compactTable);

  switch (columnKey) {
    case "name":
      return (
        <DungeonNameHeaderCell
          activeSortKey={sortKey}
          sortDirection={sortDirection}
          onSort={onSort}
          searchQuery={dungeonNameSearch}
          onSearchQueryChange={onDungeonNameSearchChange}
          sx={headerSx}
        />
      );
    case "complete":
      return (
        <SortableHeaderCell
          label={<SportsScoreIcon fontSize="small" />}
          sortKey={column.sortKey}
          sortAriaLabel={column.label}
          activeSortKey={sortKey}
          sortDirection={sortDirection}
          onSort={onSort}
          align="center"
          sx={headerSx}
        />
      );
    default:
      return (
        <SortableHeaderCell
          label={column.label}
          sortKey={column.sortKey}
          sortAriaLabel={column.label}
          activeSortKey={sortKey}
          sortDirection={sortDirection}
          onSort={onSort}
          sx={headerSx}
        />
      );
  }
}

function renderPinnedBody(
  columnKey: PinnedColumnKey,
  context: PinnedColumnBodyContext,
): ReactNode {
  const { compactTable, dungeon, completionsByDungeonId, characterCount } = context;

  switch (columnKey) {
    case "name":
      return (
        <DungeonNameCell
          name={dungeon.name}
          shortName={dungeon.shortName}
          raidKey={dungeon.raidKey}
          compact={compactTable}
          itemLevels={dungeon.itemLevel}
          emblem={dungeon.emblem ?? null}
        />
      );
    case "type":
      return (
        <DungeonTypeCell
          size={dungeon.size}
          difficulty={dungeon.difficulty}
        />
      );
    case "itemLevel":
      return <ItemLevelCell itemLevels={dungeon.itemLevel} />;
    case "complete":
      return (
        <CompletionCountChip
          completed={completionsByDungeonId[dungeon.id] ?? 0}
          total={characterCount}
        />
      );
    default: {
      const unreachable: never = columnKey;
      return unreachable;
    }
  }
}

export function renderPinnedColumnHeader(
  context: PinnedColumnHeaderContext,
): ReactNode {
  return renderPinnedHeader(context.column.key, context);
}

export function renderPinnedColumnBody(
  context: PinnedColumnBodyContext,
): ReactNode {
  return renderPinnedBody(context.column.key, context);
}

export function pinnedColumnBodyAlign(
  columnKey: PinnedColumnKey,
): "center" | undefined {
  return columnKey === "complete" ? "center" : undefined;
}

export function pinnedColumnBodySx(
  columnKey: PinnedColumnKey,
  compactTable: boolean,
) {
  return pinnedBodySxForColumn(columnKey, compactTable);
}
