import { describe, expect, it } from "vitest";
import {
  compareBossNamesByEncounterOrder,
  getBossEncounterSortIndex,
} from "./raid-boss-encounter-order.ts";

describe("raid boss encounter order", () => {
  it("orders ICC bosses by wing progression", () => {
    expect(getBossEncounterSortIndex("icecrownCitadel", "Lord Marrowgar")).toBe(
      0,
    );
    expect(getBossEncounterSortIndex("icecrownCitadel", "Rotface")).toBe(5);
    expect(
      getBossEncounterSortIndex("icecrownCitadel", "Blood-Queen Lana'thel"),
    ).toBe(8);
    expect(getBossEncounterSortIndex("icecrownCitadel", "The Lich King")).toBe(
      11,
    );
  });

  it("orders ToC bosses by encounter sequence", () => {
    expect(
      getBossEncounterSortIndex("trialOfTheCrusader", "The Beasts of Northrend"),
    ).toBe(0);
    expect(
      getBossEncounterSortIndex("trialOfTheCrusader", "Anub'arak"),
    ).toBe(4);
  });

  it("matches Russian boss labels for ICC", () => {
    expect(getBossEncounterSortIndex("icecrownCitadel", "Гниломорд")).toBe(5);
    expect(
      getBossEncounterSortIndex("icecrownCitadel", "Кровавая королева Лан'тель"),
    ).toBe(8);
  });

  it("compares bosses so earlier encounters sort first", () => {
    expect(
      compareBossNamesByEncounterOrder(
        "icecrownCitadel",
        "Sindragosa",
        "Lord Marrowgar",
        "en",
      ),
    ).toBeGreaterThan(0);
    expect(
      compareBossNamesByEncounterOrder(
        "trialOfTheCrusader",
        "The Beasts of Northrend",
        "Anub'arak",
        "en",
      ),
    ).toBeLessThan(0);
  });
});
