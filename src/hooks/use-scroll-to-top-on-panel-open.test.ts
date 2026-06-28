import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useScrollToTopOnPanelOpen } from "./use-scroll-to-top-on-panel-open.ts";

describe("useScrollToTopOnPanelOpen", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("scrolls to top when the panel id is set", () => {
    const scrollTo = vi.fn();
    window.scrollTo = scrollTo;

    renderHook(({ panelId }) => useScrollToTopOnPanelOpen(panelId), {
      initialProps: { panelId: "character" },
    });

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("scrolls again when switching to another panel", () => {
    const scrollTo = vi.fn();
    window.scrollTo = scrollTo;

    const { rerender } = renderHook(
      ({ panelId }) => useScrollToTopOnPanelOpen(panelId),
      { initialProps: { panelId: "character" } },
    );

    rerender({ panelId: "bis" });

    expect(scrollTo).toHaveBeenCalledTimes(2);
    expect(scrollTo).toHaveBeenLastCalledWith({ top: 0, behavior: "smooth" });
  });
});
