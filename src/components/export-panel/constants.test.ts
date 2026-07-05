import { describe, expect, it } from "vitest";
import {
  EXPORT_FILTER_BLOCK_SPANS,
  getExportFilterGridTemplateAreas,
} from "./constants.ts";

describe("getExportFilterGridTemplateAreas", () => {
  it("places raid, gear score, role, and specs on a 5-column grid when dungeons exist", () => {
    const areas = getExportFilterGridTemplateAreas(true);

    expect(areas).toContain("dungeon dungeon gearScore characterSpecs characterSpecs");
    expect(areas).toContain("role role . characterSpecs characterSpecs");
  });

  it("omits dungeon row when there are no dungeons", () => {
    const areas = getExportFilterGridTemplateAreas(false);

    expect(areas).not.toContain("dungeon");
    expect(areas).toContain("gearScore role role characterSpecs characterSpecs");
  });
});

describe("EXPORT_FILTER_BLOCK_SPANS", () => {
  it("uses height x width unit spans requested for each filter block", () => {
    expect(EXPORT_FILTER_BLOCK_SPANS.dungeon).toEqual({
      heightUnits: 1,
      widthUnits: 2,
    });
    expect(EXPORT_FILTER_BLOCK_SPANS.gearScore).toEqual({
      heightUnits: 1,
      widthUnits: 1,
    });
    expect(EXPORT_FILTER_BLOCK_SPANS.role).toEqual({
      heightUnits: 1,
      widthUnits: 2,
    });
    expect(EXPORT_FILTER_BLOCK_SPANS.characterSpecs).toEqual({
      heightUnits: 2,
      widthUnits: 2,
    });
  });
});
