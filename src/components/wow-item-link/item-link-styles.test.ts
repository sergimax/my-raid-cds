import { describe, expect, it } from "vitest";
import { getWotlkItemLevel } from "../../data/wotlk-item-levels.ts";
import {
  getItemLevelTier,
  getItemLevelTierColor,
} from "../../utils/item-level-tier.ts";
import { wowItemLinkColor } from "./item-link-styles.ts";

describe("wowItemLinkColor", () => {
  it("uses ilvl tier color for known items", () => {
    const itemId = 51225;
    const itemLevel = getWotlkItemLevel(itemId);
    expect(itemLevel).toBeDefined();
    expect(wowItemLinkColor(itemId, "light")).toBe(
      getItemLevelTierColor(getItemLevelTier(itemLevel!), "light"),
    );
    expect(wowItemLinkColor(itemId, "dark")).toBe(
      getItemLevelTierColor(getItemLevelTier(itemLevel!), "dark"),
    );
  });

  it("uses fallback purple for unknown item ids", () => {
    expect(wowItemLinkColor(1, "light")).toBe("#7c3aed");
    expect(wowItemLinkColor(1, "dark")).toBe("#c084fc");
  });
});
