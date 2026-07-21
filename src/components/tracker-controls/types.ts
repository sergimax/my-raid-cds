/** Subset of tracker state needed to render toolbar actions (stable while form fields edit). */
export type TrackerControlsSource = {
  charactersCount: number;
  dungeonsCount: number;
  handleAddFromTemplate: () => void;
  showCharacterForm: boolean;
  showDungeonForm: boolean;
  showExportPanel: boolean;
  showGearPickPanel: boolean;
  showBisListsPanel: boolean;
  showDataControlsPanel: boolean;
  toggleCharacterForm: () => void;
  toggleDungeonForm: () => void;
  toggleExportPanel: () => void;
  toggleGearPickPanel: () => void;
  toggleBisListsPanel: () => void;
  toggleDataControlsPanel: () => void;
};
