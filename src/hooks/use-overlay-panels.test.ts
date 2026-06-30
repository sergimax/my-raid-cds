import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TestProviders } from "../test/test-providers.tsx";
import { useOverlayPanels } from "./use-overlay-panels.ts";

const defaultOptions = {
  characters: [],
  onCharacterAdded: vi.fn(),
  onDungeonAdded: vi.fn(),
};

function renderOverlayPanels() {
  return renderHook(() => useOverlayPanels(defaultOptions), {
    wrapper: TestProviders,
  });
}

describe("useOverlayPanels", () => {
  it("opens only one panel at a time", () => {
    const { result } = renderOverlayPanels();

    act(() => {
      result.current.toggleExportPanel();
    });
    expect(result.current.showExportPanel).toBe(true);
    expect(result.current.showBisListsPanel).toBe(false);
    expect(result.current.showCharacterForm).toBe(false);

    act(() => {
      result.current.toggleCharacterForm();
    });
    expect(result.current.showExportPanel).toBe(false);
    expect(result.current.showCharacterForm).toBe(true);

    act(() => {
      result.current.toggleBisListsPanel();
    });
    expect(result.current.showCharacterForm).toBe(false);
    expect(result.current.showBisListsPanel).toBe(true);
  });

  it("closes the active panel when toggled again", () => {
    const { result } = renderOverlayPanels();

    act(() => {
      result.current.toggleDungeonForm();
    });
    expect(result.current.showDungeonForm).toBe(true);

    act(() => {
      result.current.toggleDungeonForm();
    });
    expect(result.current.showDungeonForm).toBe(false);
  });

  it("closeAllOverlayPanels clears every panel", () => {
    const { result } = renderOverlayPanels();

    act(() => {
      result.current.toggleExportPanel();
      result.current.toggleBisListsPanel();
    });
    expect(result.current.showBisListsPanel).toBe(true);
    expect(result.current.showExportPanel).toBe(false);

    act(() => {
      result.current.closeAllOverlayPanels();
    });
    expect(result.current.showExportPanel).toBe(false);
    expect(result.current.showBisListsPanel).toBe(false);
    expect(result.current.showCharacterForm).toBe(false);
    expect(result.current.showDungeonForm).toBe(false);
  });
});
