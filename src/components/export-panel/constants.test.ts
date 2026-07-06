import { describe, expect, it } from "vitest";
import {
  EXPORT_FILTER_BLOCK_SPANS,
  EXPORT_FILTER_GRID_COLUMN_COUNT,
  EXPORT_PANEL_SIDE_BY_SIDE_MIN_PX,
  EXPORT_PANEL_SIDE_BY_SIDE_MQ,
  EXPORT_PANEL_SIDE_BY_SIDE_MQ_KEY,
  EXPORT_FILTER_SPECS_UNIT_WIDTH,
  EXPORT_FILTER_SPECS_VISIBLE_ROW_COUNT,
  EXPORT_FILTER_UNIT_HEIGHT,
  EXPORT_FILTER_UNIT_WIDTH,
  getExportFilterBlockHeight,
  getExportFilterGridHeight,
  getExportFilterGridTemplateAreas,
  getExportFilterGridTemplateRows,
  getExportFilterSpecsListMaxHeight,
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

describe("export filter fixed heights", () => {
  it("uses fixed grid row heights (no auto growth)", () => {
    expect(getExportFilterGridTemplateRows()).toBe(
      `repeat(2, ${EXPORT_FILTER_UNIT_HEIGHT}px)`,
    );
  });

  it("sizes 1× and 2× blocks from the unit height", () => {
    expect(getExportFilterBlockHeight(1)).toBe(EXPORT_FILTER_UNIT_HEIGHT);
    expect(getExportFilterBlockHeight(2)).toBe(EXPORT_FILTER_UNIT_HEIGHT * 2);
  });

  it("fits eight character rows in the specs scroll viewport", () => {
    expect(getExportFilterSpecsListMaxHeight()).toBe(346);
    expect(EXPORT_FILTER_SPECS_VISIBLE_ROW_COUNT).toBe(8);
  });

  it("includes inter-row gap in total filter grid height", () => {
    expect(getExportFilterGridHeight()).toBe(EXPORT_FILTER_UNIT_HEIGHT * 2 + 12);
  });

  it("uses 1600px as the side-by-side layout threshold", () => {
    expect(EXPORT_PANEL_SIDE_BY_SIDE_MIN_PX).toBe(1600);
    expect(EXPORT_PANEL_SIDE_BY_SIDE_MQ).toBe("(min-width:1600px)");
    expect(EXPORT_PANEL_SIDE_BY_SIDE_MQ_KEY).toBe("@media (min-width:1600px)");
  });
});
