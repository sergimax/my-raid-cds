import { describe, expect, it } from "vitest";
import { resolveMainToolbarPanelId } from "./resolve-toolbar-panel-id.ts";

describe("resolveMainToolbarPanelId", () => {
  it("returns null when no main toolbar panel is open", () => {
    expect(
      resolveMainToolbarPanelId({
        showCharacterForm: false,
        showDungeonForm: false,
        showBisListsPanel: false,
      }),
    ).toBeNull();
  });

  it("prefers character over dungeon and bis", () => {
    expect(
      resolveMainToolbarPanelId({
        showCharacterForm: true,
        showDungeonForm: true,
        showBisListsPanel: true,
      }),
    ).toBe("character");
  });
});
