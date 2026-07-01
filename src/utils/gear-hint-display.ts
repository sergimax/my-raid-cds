import type { SystemStyleObject } from "@mui/system";
import type { Theme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import type { GearHintCellDisplay, GearUpgradeHintLevel } from "./gear-upgrade-hint.ts";

const BIS_HINT_ALPHAS: Record<GearUpgradeHintLevel, number> = {
  0: 0,
  1: 0.2,
  2: 0.32,
  3: 0.44,
};

/** Blue intensity for generic ilvl upgrades (not dungeon ilvl-tier rainbow). */
const ILVL_HINT_ALPHAS: Record<GearUpgradeHintLevel, number> = {
  0: 0,
  1: 0.16,
  2: 0.28,
  3: 0.4,
};

function hintDisplayBackgroundColor(
  display: GearHintCellDisplay,
  dungeonItemLevels: readonly number[],
  theme: Theme,
): string | undefined {
  if (display.level === 0 || dungeonItemLevels.length === 0) {
    return undefined;
  }

  if (display.kind === "bis") {
    return alpha(theme.palette.warning.main, BIS_HINT_ALPHAS[display.level]);
  }

  const infoMain = theme.palette.info?.main ?? theme.palette.primary.main;
  return alpha(infoMain, ILVL_HINT_ALPHAS[display.level]);
}

/** Toggle cell tint (amber BiS or blue ilvl by hint level). */
export function getGearHintCellBackgroundColor(
  display: GearHintCellDisplay,
  theme: Theme,
): string | undefined {
  return hintDisplayBackgroundColor(display, [1], theme);
}

export function gearUpgradeHintCellSx(
  display: GearHintCellDisplay | null,
  dungeonItemLevels: readonly number[],
): SystemStyleObject<Theme> | ((theme: Theme) => SystemStyleObject<Theme>) {
  if (!display || display.level === 0 || dungeonItemLevels.length === 0) {
    return {};
  }

  return (theme) => ({
    backgroundColor: hintDisplayBackgroundColor(display, dungeonItemLevels, theme),
  });
}

/** Split cell tint for main (left) and off (right) spec hints; empty halves stay untinted. */
export function gearUpgradeHintDualCellSx(
  mainDisplay: GearHintCellDisplay | null,
  offDisplay: GearHintCellDisplay | null,
  dungeonItemLevels: readonly number[],
): SystemStyleObject<Theme> | ((theme: Theme) => SystemStyleObject<Theme>) {
  if (dungeonItemLevels.length === 0) {
    return {};
  }
  if (!mainDisplay && !offDisplay) {
    return {};
  }

  return (theme) => {
    const mainColor = mainDisplay
      ? hintDisplayBackgroundColor(mainDisplay, dungeonItemLevels, theme)
      : undefined;
    const offColor = offDisplay
      ? hintDisplayBackgroundColor(offDisplay, dungeonItemLevels, theme)
      : undefined;

    if (mainColor && offColor) {
      return {
        background: `linear-gradient(to right, ${mainColor} 50%, ${offColor} 50%)`,
      };
    }
    if (mainColor) {
      return {
        background: `linear-gradient(to right, ${mainColor} 50%, transparent 50%)`,
      };
    }
    if (offColor) {
      return {
        background: `linear-gradient(to right, transparent 50%, ${offColor} 50%)`,
      };
    }
    return {};
  };
}
