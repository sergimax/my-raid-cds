import { describe, expect, it } from "vitest";
import {
  EXPORT_FILTER_SPECS_UNIT_WIDTH,
  EXPORT_FILTER_UNIT_HEIGHT,
  EXPORT_FILTER_UNIT_WIDTH,
} from "../export-panel/constants.ts";
import {
  GEAR_PICK_SIDE_BY_SIDE_MIN_PX,
  getGearPickGridTemplateAreas,
  getGearPickGridTemplateColumns,
  getGearPickGridTemplateRows,
} from "./constants.ts";

describe("getGearPickGridTemplateAreas", () => {
  it("places softs beside filters and copy full-width on medium", () => {
    const areas = getGearPickGridTemplateAreas("md");

    expect(areas).toContain("rules characterSpecs softs");
    expect(areas).toContain("dungeon characterSpecs softs");
    expect(areas).toContain("copy copy copy");
  });

  it("places copy as a fourth column on wide", () => {
    const areas = getGearPickGridTemplateAreas("wide");

    expect(areas).toContain("rules characterSpecs softs copy");
    expect(areas).toContain("dungeon characterSpecs softs copy");
    expect(areas).not.toContain("copy copy copy");
  });
});

describe("getGearPickGridTemplateColumns", () => {
  it("uses fixed filter columns plus a flexible softs column on medium", () => {
    expect(getGearPickGridTemplateColumns("md")).toBe(
      `minmax(0, ${EXPORT_FILTER_UNIT_WIDTH}px) minmax(0, ${EXPORT_FILTER_SPECS_UNIT_WIDTH}px) minmax(0, 1fr)`,
    );
  });

  it("adds a flexible copy column on wide", () => {
    expect(getGearPickGridTemplateColumns("wide")).toBe(
      `minmax(0, ${EXPORT_FILTER_UNIT_WIDTH}px) minmax(0, ${EXPORT_FILTER_SPECS_UNIT_WIDTH}px) minmax(0, 1fr) minmax(0, 1fr)`,
    );
  });
});

describe("getGearPickGridTemplateRows", () => {
  it("keeps two fixed filter rows plus an auto copy row on medium", () => {
    expect(getGearPickGridTemplateRows("md")).toBe(
      `repeat(2, ${EXPORT_FILTER_UNIT_HEIGHT}px) auto`,
    );
  });

  it("uses only the two fixed rows on wide", () => {
    expect(getGearPickGridTemplateRows("wide")).toBe(
      `repeat(2, ${EXPORT_FILTER_UNIT_HEIGHT}px)`,
    );
  });
});

describe("GEAR_PICK_SIDE_BY_SIDE_MIN_PX", () => {
  it("matches Character pick wide breakpoint", () => {
    expect(GEAR_PICK_SIDE_BY_SIDE_MIN_PX).toBe(1600);
  });
});
