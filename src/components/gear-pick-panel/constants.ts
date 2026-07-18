/** Reuses Character pick side-by-side breakpoint for filters left + items/copy right. */
export {
  EXPORT_PANEL_SIDE_BY_SIDE_MIN_PX as GEAR_PICK_SIDE_BY_SIDE_MIN_PX,
  EXPORT_PANEL_SIDE_BY_SIDE_MQ as GEAR_PICK_SIDE_BY_SIDE_MQ,
  EXPORT_PANEL_SIDE_BY_SIDE_MQ_KEY as GEAR_PICK_SIDE_BY_SIDE_MQ_KEY,
} from "../export-panel/constants.ts";

/** Gear pick filter grid areas: rules/raids 1×1, character specs 2×2. */
export type GearPickFilterGridAreaId = "rules" | "characterSpecs" | "dungeon";

export function getGearPickFilterGridTemplateAreas(): string {
  return [
    '"rules characterSpecs characterSpecs"',
    '"dungeon characterSpecs characterSpecs"',
  ].join(" ");
}
