import { describe, expect, it } from "vitest";
import {
  attachGearToSpec,
  gearItemsForSpecSave,
  initialGearLoadedForSpec,
} from "./character-edit-spec-gear.ts";

const frostGear = [{ slot: 0, id: 51225 }];

describe("initialGearLoadedForSpec", () => {
  it("returns spec name when gear is stored", () => {
    expect(
      initialGearLoadedForSpec({ spec: "Frost", gearItems: frostGear }),
    ).toBe("Frost");
  });

  it("returns empty string when spec has no gear", () => {
    expect(initialGearLoadedForSpec({ spec: "Fire" })).toBe("");
  });
});

describe("gearItemsForSpecSave", () => {
  it("keeps gear when the selected spec still matches the loaded draft", () => {
    expect(
      gearItemsForSpecSave("Frost", frostGear, "Frost"),
    ).toEqual(frostGear);
  });

  it("drops gear when the user changed spec without re-importing", () => {
    expect(gearItemsForSpecSave("Fire", frostGear, "Frost")).toBeUndefined();
  });

  it("drops gear when the loaded draft was cleared after a spec change", () => {
    expect(gearItemsForSpecSave("Fire", frostGear, "")).toBeUndefined();
  });
});

describe("attachGearToSpec", () => {
  it("omits gearItems when none are provided", () => {
    expect(attachGearToSpec({ spec: "Fire", gearScore: 6400 }, undefined)).toEqual(
      { spec: "Fire", gearScore: 6400 },
    );
  });
});
