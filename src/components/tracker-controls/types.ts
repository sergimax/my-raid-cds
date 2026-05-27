export type TrackerControlsProps = {
  showCharacterForm: boolean;
  showDungeonForm: boolean;
  onToggleCharacterForm: () => void;
  onToggleDungeonForm: () => void;
  onResetAllToggles: () => void;
  resetAllTogglesDisabled?: boolean;
  showAddFromTemplate?: boolean;
  onAddFromTemplate?: () => void;
};
