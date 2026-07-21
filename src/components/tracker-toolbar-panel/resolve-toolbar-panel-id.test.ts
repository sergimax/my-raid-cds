import { describe, expect, it } from "vitest";
import { resolveToolbarPanelId } from "./resolve-toolbar-panel-id.ts";

describe("resolveToolbarPanelId", () => {
  it("returns null when no toolbar panel is open", () => {
    expect(
      resolveToolbarPanelId({
        showCharacterForm: false,
        showDungeonForm: false,
        showBisListsPanel: false,
        showExportPanel: false,
        showGearPickPanel: false,
        showDataControlsPanel: false,
      }),
    ).toBeNull();
  });

  it("prefers character over dungeon, export, gear, bis, and data", () => {
    expect(
      resolveToolbarPanelId({
        showCharacterForm: true,
        showDungeonForm: true,
        showBisListsPanel: true,
        showExportPanel: true,
        showGearPickPanel: true,
        showDataControlsPanel: true,
      }),
    ).toBe("character");
  });

  it("returns export before gear, bis, and data when character and dungeon are closed", () => {
    expect(
      resolveToolbarPanelId({
        showCharacterForm: false,
        showDungeonForm: false,
        showBisListsPanel: true,
        showExportPanel: true,
        showGearPickPanel: true,
        showDataControlsPanel: true,
      }),
    ).toBe("export");
  });

  it("returns gear before bis and data when export is closed", () => {
    expect(
      resolveToolbarPanelId({
        showCharacterForm: false,
        showDungeonForm: false,
        showBisListsPanel: true,
        showExportPanel: false,
        showGearPickPanel: true,
        showDataControlsPanel: true,
      }),
    ).toBe("gear");
  });

  it("returns data when only the data controls panel is open", () => {
    expect(
      resolveToolbarPanelId({
        showCharacterForm: false,
        showDungeonForm: false,
        showBisListsPanel: false,
        showExportPanel: false,
        showGearPickPanel: false,
        showDataControlsPanel: true,
      }),
    ).toBe("data");
  });
});
