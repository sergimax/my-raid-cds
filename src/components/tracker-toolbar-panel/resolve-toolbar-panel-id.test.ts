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
      }),
    ).toBeNull();
  });

  it("prefers character over dungeon, export, gear, and bis", () => {
    expect(
      resolveToolbarPanelId({
        showCharacterForm: true,
        showDungeonForm: true,
        showBisListsPanel: true,
        showExportPanel: true,
        showGearPickPanel: true,
      }),
    ).toBe("character");
  });

  it("returns export before gear and bis when character and dungeon are closed", () => {
    expect(
      resolveToolbarPanelId({
        showCharacterForm: false,
        showDungeonForm: false,
        showBisListsPanel: true,
        showExportPanel: true,
        showGearPickPanel: true,
      }),
    ).toBe("export");
  });

  it("returns gear before bis when export is closed", () => {
    expect(
      resolveToolbarPanelId({
        showCharacterForm: false,
        showDungeonForm: false,
        showBisListsPanel: true,
        showExportPanel: false,
        showGearPickPanel: true,
      }),
    ).toBe("gear");
  });
});
