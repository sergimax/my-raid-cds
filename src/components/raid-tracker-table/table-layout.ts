import type { DungeonRecord } from "../../types/dungeons.ts";
import type { DungeonSortKey } from "../../utils/sort-dungeons.ts";

export const STATIC_COLUMNS: ReadonlyArray<{
  key: keyof Pick<DungeonRecord, "name" | "size" | "difficulty" | "itemLevel">;
  sortKey: DungeonSortKey;
  label: string;
}> = [
  { key: "name", sortKey: "name", label: "Dungeon name" },
  { key: "size", sortKey: "size", label: "Size" },
  { key: "difficulty", sortKey: "difficulty", label: "Mode" },
  { key: "itemLevel", sortKey: "itemLevel", label: "Item level" },
];

export const COMPLETE_COLUMN = {
  key: "complete" as const,
  sortKey: "completions" as const,
  label: "Complete",
};

export type PinnedColumnKey =
  | (typeof STATIC_COLUMNS)[number]["key"]
  | typeof COMPLETE_COLUMN.key;

export type PinnedColumnDef = {
  key: PinnedColumnKey;
  sortKey: DungeonSortKey;
  label: string;
};

/** Pinned columns after the actions column (dungeon fields + row completions). */
export const PINNED_COLUMNS: ReadonlyArray<PinnedColumnDef> = [
  ...STATIC_COLUMNS,
  COMPLETE_COLUMN,
];

const PINNED_CELL_BASE_SX = {
  position: "sticky",
  zIndex: 1,
  backgroundColor: "background.paper",
  boxShadow: "1px 0 0 rgba(0,0,0,0.08)",
  boxSizing: "border-box",
} as const;

// Keep these widths stable so sticky offsets work predictably.
export const PINNED_WIDTHS = {
  actions: 36,
  name: 200,
  size: 60,
  difficulty: 84,
  itemLevel: 104,
  complete: 78,
} as const;

export const CHARACTER_COLUMN_WIDTH = 132;

export const PINNED_LEFT = {
  actions: 0,
  name: PINNED_WIDTHS.actions,
  size: PINNED_WIDTHS.actions + PINNED_WIDTHS.name,
  difficulty: PINNED_WIDTHS.actions + PINNED_WIDTHS.name + PINNED_WIDTHS.size,
  itemLevel:
    PINNED_WIDTHS.actions +
    PINNED_WIDTHS.name +
    PINNED_WIDTHS.size +
    PINNED_WIDTHS.difficulty,
  complete:
    PINNED_WIDTHS.actions +
    PINNED_WIDTHS.name +
    PINNED_WIDTHS.size +
    PINNED_WIDTHS.difficulty +
    PINNED_WIDTHS.itemLevel,
} as const;

/** Narrow screens: hide size, mode, item level, and completions; pin actions and name only. */
export const COMPACT_PINNED_WIDTHS = {
  actions: PINNED_WIDTHS.actions,
  name: 132,
} as const;

export const COMPACT_PINNED_LEFT = {
  actions: 0,
  name: COMPACT_PINNED_WIDTHS.actions,
} as const;

const HIDDEN_PINNED_COLUMNS_ON_COMPACT: ReadonlySet<PinnedColumnKey> = new Set([
  "size",
  "difficulty",
  "itemLevel",
  "complete",
]);

export function pinnedColumnsForLayout(compact: boolean): ReadonlyArray<PinnedColumnDef> {
  if (!compact) {
    return PINNED_COLUMNS;
  }
  return PINNED_COLUMNS.filter(
    (column) => !HIDDEN_PINNED_COLUMNS_ON_COMPACT.has(column.key),
  );
}

function pinnedPositionForColumn(
  columnKey: PinnedColumnKey,
  compact: boolean,
): { left: number; width: number } | null {
  if (compact) {
    if (columnKey === "name") {
      return { left: COMPACT_PINNED_LEFT.name, width: COMPACT_PINNED_WIDTHS.name };
    }
    return null;
  }
  return { left: PINNED_LEFT[columnKey], width: PINNED_WIDTHS[columnKey] };
}

export function pinnedHeaderSxForColumn(columnKey: PinnedColumnKey, compact: boolean) {
  const position = pinnedPositionForColumn(columnKey, compact);
  if (!position) {
    return undefined;
  }
  return pinnedHeaderCellSx(position.left, position.width);
}

export function pinnedBodySxForColumn(columnKey: PinnedColumnKey, compact: boolean) {
  const position = pinnedPositionForColumn(columnKey, compact);
  if (!position) {
    return undefined;
  }
  return pinnedCellSx(position.left, position.width);
}

export function pinnedActionsColumnSx(compact: boolean, header: boolean) {
  const pinned = header ? pinnedHeaderCellSx : pinnedCellSx;
  const width = compact ? COMPACT_PINNED_WIDTHS.actions : PINNED_WIDTHS.actions;
  const left = compact ? COMPACT_PINNED_LEFT.actions : PINNED_LEFT.actions;
  return pinned(left, width);
}

export function pinnedCellSx(left: number, width: number) {
  return {
    ...PINNED_CELL_BASE_SX,
    left,
    width,
    minWidth: width,
    maxWidth: width,
  } as const;
}

export function pinnedHeaderCellSx(left: number, width: number) {
  return {
    ...pinnedCellSx(left, width),
    zIndex: 4,
  } as const;
}

export const CHARACTER_HEADER_CELL_SX = {
  width: CHARACTER_COLUMN_WIDTH,
  minWidth: CHARACTER_COLUMN_WIDTH,
  maxWidth: CHARACTER_COLUMN_WIDTH,
  paddingLeft: "6px",
  paddingRight: "6px",
  boxSizing: "border-box",
} as const;

export const CHARACTER_BODY_CELL_SX = {
  width: CHARACTER_COLUMN_WIDTH,
  minWidth: CHARACTER_COLUMN_WIDTH,
  maxWidth: CHARACTER_COLUMN_WIDTH,
  paddingLeft: "6px",
  paddingRight: "6px",
  boxSizing: "border-box",
} as const;
