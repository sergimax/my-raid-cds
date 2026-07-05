/** Width of one grid column unit (export filter blocks use width × height spans). */
export const EXPORT_FILTER_UNIT_WIDTH = 300;

/** Specs column is wider — two spec checkboxes + gear scores need more room. */
export const EXPORT_FILTER_SPECS_UNIT_WIDTH = 380;

/**
 * Fixed height of one grid row unit (1× block).
 * Fits GS slider, role 2×2 icons, and raid chip summary without inner scroll.
 */
export const EXPORT_FILTER_UNIT_HEIGHT = 224;

/** Character spec rows visible before the list scrolls (2× block content). */
export const EXPORT_FILTER_SPECS_VISIBLE_ROW_COUNT = 8;

/** Spec row height — small FormControlLabel with spec icon + gear score. */
export const EXPORT_FILTER_SPECS_ROW_HEIGHT_PX = 38;

/** Matches `rowGap: 0.75` in export-character-spec-filter (8px theme spacing). */
export const EXPORT_FILTER_SPECS_ROW_GAP_PX = 6;

/** Max scroll viewport height for the character specs list (8 rows). */
export function getExportFilterSpecsListMaxHeight(): number {
  const rowCount = EXPORT_FILTER_SPECS_VISIBLE_ROW_COUNT;
  return (
    rowCount * EXPORT_FILTER_SPECS_ROW_HEIGHT_PX +
    (rowCount - 1) * EXPORT_FILTER_SPECS_ROW_GAP_PX
  );
}

/** Total height of a block spanning `heightUnits` grid rows (excludes inter-row gap). */
export function getExportFilterBlockHeight(heightUnits: number): number {
  return heightUnits * EXPORT_FILTER_UNIT_HEIGHT;
}

/** Column units across the filter grid (GS + role + specs). */
export const EXPORT_FILTER_GRID_COLUMN_COUNT = 3;

export type ExportFilterBlockSpan = {
  /** Row span — height in unit rows (H in H×W). */
  heightUnits: number;
  /** Column span — width in unit columns (W in H×W). */
  widthUnits: number;
};

/** Default H×W spans per filter block. */
export const EXPORT_FILTER_BLOCK_SPANS = {
  dungeon: { heightUnits: 1, widthUnits: 2 },
  gearScore: { heightUnits: 1, widthUnits: 1 },
  role: { heightUnits: 1, widthUnits: 1 },
  characterSpecs: { heightUnits: 2, widthUnits: 1 },
} as const satisfies Record<string, ExportFilterBlockSpan>;

export type ExportFilterGridAreaId = keyof typeof EXPORT_FILTER_BLOCK_SPANS;

export function getExportFilterGridTemplateColumns(): string {
  const standardColumn = `minmax(0, ${EXPORT_FILTER_UNIT_WIDTH}px)`;
  const specsColumn = `minmax(0, ${EXPORT_FILTER_SPECS_UNIT_WIDTH}px)`;
  return `${standardColumn} ${standardColumn} ${specsColumn}`;
}

export function getExportFilterGridTemplateRows(): string {
  const maxHeightUnits = Math.max(
    ...Object.values(EXPORT_FILTER_BLOCK_SPANS).map((span) => span.heightUnits),
  );
  return `repeat(${maxHeightUnits}, ${EXPORT_FILTER_UNIT_HEIGHT}px)`;
}

export function getExportFilterGridTemplateAreas(hasDungeon: boolean): string {
  if (hasDungeon) {
    return [
      '"gearScore role characterSpecs"',
      '"dungeon dungeon characterSpecs"',
    ].join(" ");
  }

  return [
    '"gearScore role characterSpecs"',
    '". . characterSpecs"',
  ].join(" ");
}

export function getExportFilterGridMaxWidth(): number {
  return (
    EXPORT_FILTER_UNIT_WIDTH * (EXPORT_FILTER_GRID_COLUMN_COUNT - 1) +
    EXPORT_FILTER_SPECS_UNIT_WIDTH
  );
}
