import {
  EXPORT_FILTER_GRID_GAP_SPACING,
  EXPORT_FILTER_UNIT_HEIGHT,
  EXPORT_FILTER_UNIT_WIDTH,
  getFilterUnitColumnTemplate,
} from "../export-panel/constants.ts";

/** 2×2 unit grid: toggles | characters / dungeons | BiS. */
export const DATA_CONTROLS_GRID_COLUMN_COUNT = 2;
export const DATA_CONTROLS_GRID_ROW_COUNT = 2;

export type DataControlsGridAreaId =
  | "resetToggles"
  | "deleteCharacters"
  | "deleteDungeons"
  | "deleteBisLists";

export function getDataControlsGridTemplateColumns(): string {
  const unitColumn = getFilterUnitColumnTemplate();
  return `${unitColumn} ${unitColumn}`;
}

export function getDataControlsGridTemplateRows(): string {
  return `repeat(${DATA_CONTROLS_GRID_ROW_COUNT}, ${EXPORT_FILTER_UNIT_HEIGHT}px)`;
}

export function getDataControlsGridTemplateAreas(): string {
  return [
    '"resetToggles deleteCharacters"',
    '"deleteDungeons deleteBisLists"',
  ].join(" ");
}

/** Content width of the 2-column unit grid (columns + inter-column gap). */
export function getDataControlsGridMaxWidth(
  gridColumnGapPx = EXPORT_FILTER_GRID_GAP_SPACING * 8,
): number {
  return (
    DATA_CONTROLS_GRID_COLUMN_COUNT * EXPORT_FILTER_UNIT_WIDTH +
    (DATA_CONTROLS_GRID_COLUMN_COUNT - 1) * gridColumnGapPx
  );
}

export { EXPORT_FILTER_GRID_GAP_SPACING, EXPORT_FILTER_UNIT_WIDTH };
