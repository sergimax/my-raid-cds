export type MainToolbarPanelId = "character" | "dungeon" | "bis";

export function resolveMainToolbarPanelId(options: {
  showCharacterForm: boolean;
  showDungeonForm: boolean;
  showBisListsPanel: boolean;
}): MainToolbarPanelId | null {
  if (options.showCharacterForm) {
    return "character";
  }
  if (options.showDungeonForm) {
    return "dungeon";
  }
  if (options.showBisListsPanel) {
    return "bis";
  }
  return null;
}
