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

const PINNED_CELL_BASE_SX = {
  position: "sticky",
  zIndex: 1,
  backgroundColor: "background.paper",
  boxShadow: "1px 0 0 rgba(0,0,0,0.08)",
  boxSizing: "border-box",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
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
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
} as const;

export const CHARACTER_BODY_CELL_SX = {
  width: CHARACTER_COLUMN_WIDTH,
  minWidth: CHARACTER_COLUMN_WIDTH,
  maxWidth: CHARACTER_COLUMN_WIDTH,
  paddingLeft: "6px",
  paddingRight: "6px",
  boxSizing: "border-box",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
} as const;

