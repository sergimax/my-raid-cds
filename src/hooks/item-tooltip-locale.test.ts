import { beforeEach, describe, expect, it, vi } from "vitest";
import { ITEM_TOOLTIP_LOCALE_STORAGE_KEY } from "../constants/item-tooltips.ts";
import { getInitialItemTooltipLocale } from "./item-tooltip-locale.ts";

describe("getInitialItemTooltipLocale", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("defaults to Russian when nothing is stored", () => {
    expect(getInitialItemTooltipLocale()).toBe("ru");
  });

  it("uses a valid stored locale", () => {
    localStorage.setItem(ITEM_TOOLTIP_LOCALE_STORAGE_KEY, "en");
    expect(getInitialItemTooltipLocale()).toBe("en");
  });

  it("falls back to Russian for an invalid stored value", () => {
    localStorage.setItem(ITEM_TOOLTIP_LOCALE_STORAGE_KEY, "de");
    expect(getInitialItemTooltipLocale()).toBe("ru");
  });

  it("falls back to Russian when localStorage throws", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("quota");
    });
    expect(getInitialItemTooltipLocale()).toBe("ru");
    vi.restoreAllMocks();
  });
});
