/** Matches add-character / add-dungeon form width. */
export const TRACKER_NARROW_PANEL_MAX_WIDTH = 480;

/**
 * Cap for BiS lists (class/spec | items | lists). Narrower than the unit-grid
 * panels so three columns stay readable on ultrawide viewports.
 */
export const TRACKER_WIDE_PANEL_MAX_WIDTH = 1280;

/**
 * Cap for Character pick / Soft pick. Sized for the shared 300px unit grid:
 * filters + a 2-unit results/softs column + Soft pick copy (1×2), without
 * collapsing the Soft reserve targets block on wide layouts.
 */
export const TRACKER_UNIT_GRID_PANEL_MAX_WIDTH = 1920;
