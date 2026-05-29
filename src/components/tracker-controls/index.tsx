import { Box, Button } from "@mui/material";
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
    <Box
      component="nav"
      aria-label="Tracker actions"
      sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1 }}
    >
      {showAddFromTemplate && onAddFromTemplate ? (
        <Button
          size="small"
          variant="contained"
          color="secondary"
          onClick={onAddFromTemplate}
        >
          Add from template
        </Button>
      ) : null}
      <Button
        size="small"
        variant={showCharacterForm ? "contained" : "outlined"}
        color="inherit"
        aria-expanded={showCharacterForm}
        onClick={onToggleCharacterForm}
        sx={{ display: "block" }}
      >
        Add character
      </Button>
      <Button
        size="small"
        variant={showDungeonForm ? "contained" : "outlined"}
        color="inherit"
        aria-expanded={showDungeonForm}
        onClick={onToggleDungeonForm}
        sx={{ display: "block" }}
      >
        Add dungeon
      </Button>
      <Button
        size="small"
        variant="text"
        color="warning"
        disabled={resetAllTogglesDisabled}
        onClick={onResetAllToggles}
        sx={{ display: "block" }}
      >
        Reset all toggles
      </Button>
    </Box>
  );
}
