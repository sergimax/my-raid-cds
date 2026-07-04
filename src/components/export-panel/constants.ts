/** Max width of a single export filter block. */
export const EXPORT_FILTER_BLOCK_MAX_WIDTH = 300;

/** Filter blocks per row on md+ (raid, gear score, role, character specs). */
export const EXPORT_FILTER_GRID_COLUMN_COUNT = 4;

export function getExportFilterBlockMaxWidthCss(): string {
  return `${EXPORT_FILTER_BLOCK_MAX_WIDTH}px`;
}
