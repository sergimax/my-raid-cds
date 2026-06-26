import { describe, expect, it, vi } from "vitest";
import { hideExternalWowTooltips } from "./hide-external-wow-tooltips.ts";

describe("hideExternalWowTooltips", () => {
  it("calls hide on known third-party tooltip globals", () => {
    const hideCoTTooltip = vi.fn();
    const hideCoT = vi.fn();
    const hideWowRoad = vi.fn();

    Object.assign(window, {
      $CoTTooltip: { hideTooltip: hideCoTTooltip },
      $CoT: { Tooltip: { hide: hideCoT } },
      Tooltip: { hide: hideWowRoad },
    });

    hideExternalWowTooltips();

    expect(hideCoTTooltip).toHaveBeenCalledOnce();
    expect(hideCoT).toHaveBeenCalledOnce();
    expect(hideWowRoad).toHaveBeenCalledOnce();
  });
});
