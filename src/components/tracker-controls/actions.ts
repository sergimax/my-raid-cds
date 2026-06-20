import type { ButtonProps } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { RaidTrackerContextValue } from "../../hooks/use-raid-tracker-context.ts";

export type TrackerActionId =
  | "addFromTemplate"
  | "addCharacter"
  | "addDungeon"
  | "importStatus"
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

export function buildTrackerActions(tracker: RaidTrackerContextValue): TrackerAction[] {
  const showAddFromTemplate = tracker.dungeons.length === 0;
  const resetAllTogglesDisabled = !tracker.canResetAllToggles;

  return [
    {
      id: "addFromTemplate",
      label: "Add from template",
      onClick: tracker.handleAddFromTemplate,
      visible: showAddFromTemplate,
      buttonVariant: "contained",
      buttonColor: "secondary",
    },
    {
      id: "addCharacter",
      label: "Add character",
      onClick: tracker.toggleCharacterForm,
      selected: tracker.showCharacterForm,
      buttonVariant: tracker.showCharacterForm ? "contained" : "outlined",
      buttonColor: "inherit",
      ariaExpanded: tracker.showCharacterForm,
    },
    {
      id: "addDungeon",
      label: "Add dungeon",
      onClick: tracker.toggleDungeonForm,
      selected: tracker.showDungeonForm,
      buttonVariant: tracker.showDungeonForm ? "contained" : "outlined",
      buttonColor: "inherit",
      ariaExpanded: tracker.showDungeonForm,
    },
    {
      id: "importStatus",
      label: "Import",
      onClick: tracker.toggleImportPanel,
      selected: tracker.showImportPanel,
      buttonVariant: tracker.showImportPanel ? "contained" : "outlined",
      buttonColor: "inherit",
      ariaExpanded: tracker.showImportPanel,
      disabled: tracker.characters.length === 0 || tracker.dungeons.length === 0,
    },
    {
      id: "resetAllToggles",
      label: "Reset all toggles",
      onClick: tracker.handleResetAllToggles,
      disabled: resetAllTogglesDisabled,
      buttonVariant: "text",
      buttonColor: "warning",
      menuItemSx: resetAllTogglesDisabled ? undefined : { color: "warning.main" },
    },
  ];
}
