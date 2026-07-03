import { describe, expect, it } from "vitest";
import {
  attachGearToSpec,
  gearItemsForSpecSave,
  initialGearLoadedForSpec,
  initialSpecGearSyncBaseline,
  specGearSyncBaselineAfterSpecChange,
} from "./character-edit-spec-gear.ts";
import { getSpecGearSyncHints } from "../../utils/character-spec-gear-sync-hints.ts";

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

describe("initialSpecGearSyncBaseline", () => {
  it("uses stored gear when the dialog opens on the saved spec", () => {
    expect(
      initialSpecGearSyncBaseline(
        { spec: "Frost", gearScore: 6600, gearItems: frostGear },
        "Frost",
        "6600",
      ),
    ).toEqual({
      gearItems: frostGear,
      gearScoreText: "6600",
    });
  });

  it("clears gear baseline when the stored spec differs from the form spec", () => {
    expect(
      initialSpecGearSyncBaseline(
        { spec: "Frost", gearScore: 6600, gearItems: frostGear },
        "Blood",
        "6600",
      ),
    ).toEqual({
      gearItems: undefined,
      gearScoreText: "6600",
    });
  });
});

describe("specGearSyncBaselineAfterSpecChange", () => {
  it("resets gear baseline and keeps the current gear score text", () => {
    expect(specGearSyncBaselineAfterSpecChange("6700")).toEqual({
      gearItems: undefined,
      gearScoreText: "6700",
    });
  });

  it("does not suggest update gear score after spec change clears gear", () => {
    const baseline = specGearSyncBaselineAfterSpecChange("6600");
    expect(
      getSpecGearSyncHints({
        spec: "Blood",
        initialGearScoreText: baseline.gearScoreText,
        gearScoreText: "6600",
        initialGearItems: baseline.gearItems,
        currentGearItems: undefined,
      }),
    ).toEqual({
      suggestImportGear: false,
      suggestUpdateGearScore: false,
    });
  });
});
