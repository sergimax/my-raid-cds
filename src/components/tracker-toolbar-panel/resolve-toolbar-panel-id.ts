export type MainToolbarPanelId = "character" | "dungeon" | "bis" | "data";

export type ToolbarPanelId = MainToolbarPanelId | "export" | "gear";

export function resolveToolbarPanelId(options: {
  showCharacterForm: boolean;
  showDungeonForm: boolean;
  showBisListsPanel: boolean;
  showExportPanel: boolean;
  showGearPickPanel: boolean;
  showDataControlsPanel: boolean;
}): ToolbarPanelId | null {
  if (options.showCharacterForm) {
    return "character";
  }
  if (options.showDungeonForm) {
    return "dungeon";
  }
  if (options.showExportPanel) {
    return "export";
  }
  if (options.showGearPickPanel) {
    return "gear";
  }
  if (options.showBisListsPanel) {
    return "bis";
  }
  if (options.showDataControlsPanel) {
    return "data";
  }
  return null;
}
