import type { ButtonProps } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { TrackerControlsSource } from "./types.ts";

export type { TrackerControlsSource } from "./types.ts";

export type TrackerActionId =
  | "addFromTemplate"
  | "addCharacter"
  | "addDungeon"
  | "exportStatus"
  | "resetAllToggles";

export type TrackerAction = {
  id: TrackerActionId;
  label: string;
  onClick: () => void;
  visible?: boolean;
  disabled?: boolean;
  selected?: boolean;
  buttonVariant?: ButtonProps["variant"];
  buttonColor?: ButtonProps["color"];
  ariaExpanded?: boolean;
  menuItemSx?: SxProps<Theme>;
};

export function buildTrackerActions(
  source: TrackerControlsSource,
): TrackerAction[] {
  const showAddFromTemplate = source.dungeonsCount === 0;
  const resetAllTogglesDisabled = !source.canResetAllToggles;

  return [
    {
      id: "addFromTemplate",
      label: "Add from template",
      onClick: source.handleAddFromTemplate,
      visible: showAddFromTemplate,
      buttonVariant: "contained",
      buttonColor: "secondary",
    },
    {
      id: "addCharacter",
      label: "Add character",
      onClick: source.toggleCharacterForm,
      selected: source.showCharacterForm,
      buttonVariant: source.showCharacterForm ? "contained" : "outlined",
      buttonColor: "inherit",
      ariaExpanded: source.showCharacterForm,
    },
    {
      id: "addDungeon",
      label: "Add dungeon",
      onClick: source.toggleDungeonForm,
      selected: source.showDungeonForm,
      buttonVariant: source.showDungeonForm ? "contained" : "outlined",
      buttonColor: "inherit",
      ariaExpanded: source.showDungeonForm,
    },
    {
      id: "exportStatus",
      label: "Export",
      onClick: source.toggleExportPanel,
      selected: source.showExportPanel,
      buttonVariant: source.showExportPanel ? "contained" : "outlined",
      buttonColor: "inherit",
      ariaExpanded: source.showExportPanel,
      disabled: source.charactersCount === 0 || source.dungeonsCount === 0,
    },
    {
      id: "resetAllToggles",
      label: "Reset all toggles",
      onClick: source.handleResetAllToggles,
      disabled: resetAllTogglesDisabled,
      buttonVariant: "text",
      buttonColor: "warning",
      menuItemSx: resetAllTogglesDisabled ? undefined : { color: "warning.main" },
    },
  ];
}
