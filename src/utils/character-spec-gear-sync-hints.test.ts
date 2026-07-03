import { describe, expect, it } from "vitest";
import {
  areCharacterGearItemsEqual,
  getSpecGearSyncHints,
} from "./character-spec-gear-sync-hints.ts";

describe("areCharacterGearItemsEqual", () => {
  it("treats undefined and empty arrays as different", () => {
    expect(areCharacterGearItemsEqual(undefined, [])).toBe(false);
    expect(areCharacterGearItemsEqual([], undefined)).toBe(false);
  });

  it("compares slot order independently", () => {
    expect(
      areCharacterGearItemsEqual(
        [{ slot: 1, id: 100 }],
        [{ slot: 1, id: 100 }],
      ),
    ).toBe(true);
    expect(
      areCharacterGearItemsEqual(
        [{ slot: 5, id: 200 }, { slot: 1, id: 100 }],
        [{ slot: 1, id: 100 }, { slot: 5, id: 200 }],
      ),
    ).toBe(true);
  });
});

describe("getSpecGearSyncHints", () => {
  const base = {
    spec: "Frost",
    initialGearScoreText: "6600",
    gearScoreText: "6600",
    initialGearItems: [{ slot: 1, id: 100 }] as const,
    currentGearItems: [{ slot: 1, id: 100 }] as const,
  };

  it("returns no hints when nothing changed", () => {
    expect(getSpecGearSyncHints(base)).toEqual({
      suggestImportGear: false,
      suggestUpdateGearScore: false,
    });
  });

  it("suggests re-import when gear score changed but gear did not", () => {
    expect(
      getSpecGearSyncHints({
        ...base,
        gearScoreText: "6700",
      }),
    ).toEqual({
      suggestImportGear: true,
      suggestUpdateGearScore: false,
    });
  });

  it("suggests updating gear score when gear changed but score did not", () => {
    expect(
      getSpecGearSyncHints({
        ...base,
        currentGearItems: [{ slot: 1, id: 200 }],
      }),
    ).toEqual({
      suggestImportGear: false,
      suggestUpdateGearScore: true,
    });
  });

  it("returns no hints when both gear score and gear changed", () => {
    expect(
      getSpecGearSyncHints({
        ...base,
        gearScoreText: "6700",
        currentGearItems: [{ slot: 1, id: 200 }],
      }),
    ).toEqual({
      suggestImportGear: false,
      suggestUpdateGearScore: false,
    });
  });

  it("suggests gear score update when gear is imported for the first time", () => {
    expect(
      getSpecGearSyncHints({
        spec: "Frost",
        initialGearScoreText: "",
        gearScoreText: "",
        initialGearItems: undefined,
        currentGearItems: [{ slot: 1, id: 100 }],
      }),
    ).toEqual({
      suggestImportGear: false,
      suggestUpdateGearScore: true,
    });
  });

  it("does not suggest import when gear score was cleared", () => {
    expect(
      getSpecGearSyncHints({
        ...base,
        gearScoreText: "",
      }),
    ).toEqual({
      suggestImportGear: false,
      suggestUpdateGearScore: false,
    });
  });
});
