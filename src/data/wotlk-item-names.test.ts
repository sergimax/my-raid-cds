import { describe, expect, it } from "vitest";
import { getWotlkItemName } from "./wotlk-item-names.ts";

describe("getWotlkItemName", () => {
  it("returns English names by default", () => {
    expect(getWotlkItemName(51312)).toBe("Sanctified Scourgelord Helmet");
  });

  it("returns Russian names when locale is ru", () => {
    expect(getWotlkItemName(51312, "ru")).toBe(
      "Освященный полный шлем повелителя Плети",
    );
  });

  it("falls back to English when Russian name is missing", () => {
    expect(getWotlkItemName(99999999, "ru")).toBeUndefined();
    expect(getWotlkItemName(51312, "ru")).toBe(
      "Освященный полный шлем повелителя Плети",
    );
  });
});
