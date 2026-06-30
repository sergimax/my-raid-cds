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
      }),
    ).toBeNull();
  });

  it("prefers character over dungeon, export, and bis", () => {
    expect(
      resolveToolbarPanelId({
        showCharacterForm: true,
        showDungeonForm: true,
        showBisListsPanel: true,
        showExportPanel: true,
      }),
    ).toBe("character");
  });

  it("returns export before bis when character and dungeon are closed", () => {
    expect(
      resolveToolbarPanelId({
        showCharacterForm: false,
        showDungeonForm: false,
        showBisListsPanel: true,
        showExportPanel: true,
      }),
    ).toBe("export");
  });
});
