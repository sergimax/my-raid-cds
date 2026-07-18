import {
  EXPORT_FILTER_SPECS_UNIT_WIDTH,
  EXPORT_FILTER_UNIT_WIDTH,
  getExportFilterGridTemplateRows,
} from "../export-panel/constants.ts";

/** Reuses Character pick side-by-side breakpoint (≥1600px) for the wide Soft pick layout. */
export {
  EXPORT_PANEL_SIDE_BY_SIDE_MIN_PX as GEAR_PICK_SIDE_BY_SIDE_MIN_PX,
  EXPORT_PANEL_SIDE_BY_SIDE_MQ as GEAR_PICK_SIDE_BY_SIDE_MQ,
  EXPORT_PANEL_SIDE_BY_SIDE_MQ_KEY as GEAR_PICK_SIDE_BY_SIDE_MQ_KEY,
} from "../export-panel/constants.ts";

/**
 * Soft pick panel grid areas.
 * - xs: stacked (DOM order)
 * - md: filters + softs; copy full-width below
 * - wide (≥1600): filters + softs + copy in one 2-row grid
 */
export type GearPickGridAreaId =
  | "rules"
  | "characterSpecs"
  | "dungeon"
  | "softs"
  | "copy";

export type GearPickGridLayout = "md" | "wide";

export function getGearPickGridTemplateAreas(layout: GearPickGridLayout): string {
  if (layout === "wide") {
    return [
      '"rules characterSpecs softs copy"',
      '"dungeon characterSpecs softs copy"',
    ].join(" ");
  }

  return [
    '"rules characterSpecs softs"',
    '"dungeon characterSpecs softs"',
    '"copy copy copy"',
  ].join(" ");
}

export function getGearPickGridTemplateColumns(
  layout: GearPickGridLayout,
): string {
  const standardColumn = `minmax(0, ${EXPORT_FILTER_UNIT_WIDTH}px)`;
  const specsColumn = `minmax(0, ${EXPORT_FILTER_SPECS_UNIT_WIDTH}px)`;
  const flexibleColumn = "minmax(0, 1fr)";

  if (layout === "wide") {
    return `${standardColumn} ${specsColumn} ${flexibleColumn} ${flexibleColumn}`;
  }

  return `${standardColumn} ${specsColumn} ${flexibleColumn}`;
}

export function getGearPickGridTemplateRows(layout: GearPickGridLayout): string {
  const filterRows = getExportFilterGridTemplateRows();
  if (layout === "wide") {
    return filterRows;
  }
  return `${filterRows} auto`;
}
