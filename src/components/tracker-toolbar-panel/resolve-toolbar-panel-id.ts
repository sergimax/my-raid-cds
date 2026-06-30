export type MainToolbarPanelId = "character" | "dungeon" | "bis";

export type ToolbarPanelId = MainToolbarPanelId | "export";

export function resolveToolbarPanelId(options: {
  showCharacterForm: boolean;
  showDungeonForm: boolean;
  showBisListsPanel: boolean;
  showExportPanel: boolean;
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
  if (options.showBisListsPanel) {
    return "bis";
  }
  return null;
}

/** @deprecated Use resolveToolbarPanelId */
export function resolveMainToolbarPanelId(options: {
  showCharacterForm: boolean;
  showDungeonForm: boolean;
  showBisListsPanel: boolean;
}): MainToolbarPanelId | null {
  return resolveToolbarPanelId({ ...options, showExportPanel: false });
}
