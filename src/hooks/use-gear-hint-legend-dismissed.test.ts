import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GEAR_HINT_LEGEND_DISMISSED_STORAGE_KEY } from "../constants/gear-hint-legend.ts";
import { useGearHintLegendDismissed } from "./use-gear-hint-legend-dismissed.ts";

describe("useGearHintLegendDismissed", () => {
  it("reads dismissed state from localStorage on mount", () => {
    localStorage.setItem(GEAR_HINT_LEGEND_DISMISSED_STORAGE_KEY, "1");

    const { result } = renderHook(() => useGearHintLegendDismissed());

    expect(result.current.dismissed).toBe(true);
  });

  it("dismiss hides the legend and persists for new hook instances", () => {
    localStorage.removeItem(GEAR_HINT_LEGEND_DISMISSED_STORAGE_KEY);

    const { result, unmount } = renderHook(() => useGearHintLegendDismissed());

    expect(result.current.dismissed).toBe(false);

    act(() => {
      result.current.dismiss();
    });

    expect(result.current.dismissed).toBe(true);
    unmount();

    const { result: reloaded } = renderHook(() => useGearHintLegendDismissed());
    expect(reloaded.current.dismissed).toBe(true);
  });
});
