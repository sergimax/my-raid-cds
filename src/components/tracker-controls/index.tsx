import { Button, Stack } from "@mui/material";
import type { TrackerControlsProps } from "./types.ts";

export function TrackerControls({
  showCharacterForm,
  showDungeonForm,
  onToggleCharacterForm,
  onToggleDungeonForm,
  onResetAllToggles,
  resetAllTogglesDisabled = false,
  showAddFromTemplate = false,
  onAddFromTemplate,
}: TrackerControlsProps) {
  return (
    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
      {showAddFromTemplate && onAddFromTemplate ? (
        <Button variant="contained" color="secondary" onClick={onAddFromTemplate}>
          Add from template
        </Button>
      ) : null}
      <Button
        variant={showCharacterForm ? "contained" : "outlined"}
        color="primary"
        aria-expanded={showCharacterForm}
        onClick={onToggleCharacterForm}
      >
        Add character
      </Button>
      <Button
        variant={showDungeonForm ? "contained" : "outlined"}
        color="primary"
        aria-expanded={showDungeonForm}
        onClick={onToggleDungeonForm}
      >
        Add dungeon
      </Button>
      <Button
        variant="outlined"
        color="warning"
        disabled={resetAllTogglesDisabled}
        onClick={onResetAllToggles}
      >
        Reset all toggles
      </Button>
    </Stack>
  );
}
