import type { SystemStyleObject } from "@mui/system";
import type { Theme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import type { GearHintCellDisplay, GearUpgradeHintLevel } from "./gear-upgrade-hint.ts";

type HintAlphaScale = Record<GearUpgradeHintLevel, number>;

/** BiS (amber) cell tint opacity by hint level — slightly stronger in dark mode. */
const BIS_HINT_ALPHAS_LIGHT: HintAlphaScale = {
  0: 0,
  1: 0.22,
  2: 0.32,
  3: 0.44,
};

const BIS_HINT_ALPHAS_DARK: HintAlphaScale = {
  0: 0,
  1: 0.26,
  2: 0.38,
  3: 0.5,
};

/** Ilvl (blue) cell tint opacity by hint level — slightly stronger in dark mode. */
const ILVL_HINT_ALPHAS_LIGHT: HintAlphaScale = {
  0: 0,
  1: 0.18,
  2: 0.28,
  3: 0.4,
};

const ILVL_HINT_ALPHAS_DARK: HintAlphaScale = {
  0: 0,
  1: 0.22,
  2: 0.34,
  3: 0.46,
};

function hintAlphasForMode(
  mode: "light" | "dark",
  kind: GearHintCellDisplay["kind"],
): HintAlphaScale {
  if (kind === "bis") {
    return mode === "dark" ? BIS_HINT_ALPHAS_DARK : BIS_HINT_ALPHAS_LIGHT;
  }
  return mode === "dark" ? ILVL_HINT_ALPHAS_DARK : ILVL_HINT_ALPHAS_LIGHT;
}

function hintDisplayBackgroundColor(
  display: GearHintCellDisplay,
  dungeonItemLevels: readonly number[],
  theme: Theme,
): string | undefined {
  if (display.level === 0 || dungeonItemLevels.length === 0) {
    return undefined;
  }

  const alphas = hintAlphasForMode(theme.palette.mode, display.kind);
  const opacity = alphas[display.level];

  if (display.kind === "bis") {
    return alpha(theme.palette.warning.main, opacity);
  }

  const infoMain = theme.palette.info?.main ?? theme.palette.primary.main;
  return alpha(infoMain, opacity);
}

/** Solid BiS (amber) or ilvl (blue) accent — tooltip dots, legends. */
export function getGearHintKindColor(
  kind: GearHintCellDisplay["kind"],
  theme: Theme,
): string {
  if (kind === "bis") {
    return theme.palette.warning.main;
  }

  return theme.palette.info?.main ?? theme.palette.primary.main;
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
