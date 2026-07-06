import type { PaletteMode } from "@mui/material/styles";

export type TooltipSurfaceColors = {
  bgcolor: string;
  color: string;
  mutedColor: string;
  borderColor: string;
};

/** Tooltip panel colors — inverted in light app mode for readable rich content. */
export function getTooltipSurface(mode: PaletteMode): TooltipSurfaceColors {
  if (mode === "light") {
    return {
      bgcolor: "#27272a",
      color: "#fafafa",
      mutedColor: "#d4d4d8",
      borderColor: "#3f3f46",
    };
  }

  return {
    bgcolor: "#3f3f46",
    color: "#fafafa",
    mutedColor: "#d4d4d8",
    borderColor: "#52525b",
  };
}

/** Ilvl link palette for tooltip backgrounds (always the bright/dark-theme set). */
export const TOOLTIP_ITEM_LINK_COLOR_MODE = "dark" as const;
