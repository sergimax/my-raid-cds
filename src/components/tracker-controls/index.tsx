import { Button, Stack } from "@mui/material";
import type { TrackerControlsProps } from "./types.ts";

export function TrackerControls({
  showCharacterForm,
  showDungeonForm,
  onToggleCharacterForm,
  onToggleDungeonForm,
  onResetAllToggles,
}: TrackerControlsProps) {
  return (
    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
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
      <Button variant="outlined" color="warning" onClick={onResetAllToggles}>
        Reset all toggles
      </Button>
    </Stack>
  );
}
