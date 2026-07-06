import type { Theme } from "@mui/material/styles";
import type { SystemStyleObject } from "@mui/system";
import { getWotlkItemLevel } from "../../data/wotlk-item-levels.ts";
import {
  getItemLevelTier,
  getItemLevelTierColor,
} from "../../utils/item-level-tier.ts";

const WOW_ITEM_UNKNOWN_COLORS = {
  light: "#7c3aed",
  dark: "#c084fc",
} as const;

export function wowItemLinkColor(
  itemId: number,
  colorMode: "light" | "dark",
): string {
  const itemLevel = getWotlkItemLevel(itemId);
  if (itemLevel === undefined) {
    return WOW_ITEM_UNKNOWN_COLORS[colorMode];
  }
  return getItemLevelTierColor(getItemLevelTier(itemLevel), colorMode);
}

export function wowItemLinkSx(
  itemId: number,
  colorMode?: "light" | "dark",
): (theme: Theme) => SystemStyleObject<Theme> {
  return (theme) => ({
    display: "inline",
    color: wowItemLinkColor(itemId, colorMode ?? theme.palette.mode),
    fontWeight: 600,
    textDecoration: "underline",
    textDecorationStyle: "dotted",
    textUnderlineOffset: "0.15em",
    "&:hover": {
      textDecorationStyle: "solid",
    },
  });
}
