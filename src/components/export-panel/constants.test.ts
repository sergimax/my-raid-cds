import { describe, expect, it } from "vitest";
import {
  EXPORT_FILTER_BLOCK_SPANS,
  EXPORT_FILTER_GRID_COLUMN_COUNT,
  EXPORT_FILTER_SPECS_UNIT_WIDTH,
  EXPORT_FILTER_UNIT_WIDTH,
  getExportFilterGridTemplateAreas,
} from "./constants.ts";

describe("getExportFilterGridTemplateAreas", () => {
  it("places GS, role, and specs on row one; raid spans two columns on row two", () => {
    const areas = getExportFilterGridTemplateAreas(true);

    expect(areas).toContain("gearScore role characterSpecs");
    expect(areas).toContain("dungeon dungeon characterSpecs");
  });

  it("omits dungeon row when there are no dungeons", () => {
    const areas = getExportFilterGridTemplateAreas(false);

    expect(areas).not.toContain("dungeon");
    expect(areas).toContain("gearScore role characterSpecs");
    expect(areas).toContain(". . characterSpecs");
  });
});

describe("EXPORT_FILTER_BLOCK_SPANS", () => {
  it("uses a three-column grid with specs spanning two rows", () => {
    expect(EXPORT_FILTER_GRID_COLUMN_COUNT).toBe(3);
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
      widthUnits: 1,
    });
    expect(EXPORT_FILTER_BLOCK_SPANS.characterSpecs).toEqual({
      heightUnits: 2,
      widthUnits: 1,
    });
    expect(EXPORT_FILTER_SPECS_UNIT_WIDTH).toBeGreaterThan(EXPORT_FILTER_UNIT_WIDTH);
  });
});
