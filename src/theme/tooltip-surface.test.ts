import { describe, expect, it } from "vitest";
import { getTooltipSurface } from "./tooltip-surface.ts";

describe("getTooltipSurface", () => {
  it("uses a dark inverted panel in light app mode", () => {
    const surface = getTooltipSurface("light");
    expect(surface.bgcolor).toBe("#27272a");
    expect(surface.color).toBe("#fafafa");
  });

  it("uses an elevated panel in dark app mode", () => {
    const surface = getTooltipSurface("dark");
    expect(surface.bgcolor).toBe("#3f3f46");
    expect(surface.color).toBe("#fafafa");
  });
});
