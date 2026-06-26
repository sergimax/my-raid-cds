import { describe, expect, it } from "vitest";
import { buildWowItemUrl } from "./wow-item-url.ts";

describe("buildWowItemUrl", () => {
  it("builds Cavern of Time links for English tooltips", () => {
    expect(buildWowItemUrl(51312, "en")).toBe(
      "https://wotlk.cavernoftime.com/item=51312",
    );
  });

  it("builds WoWRoad links for Russian tooltips", () => {
    expect(buildWowItemUrl(51312, "ru")).toBe(
      "https://wowroad.info/?item=51312",
    );
  });
});
