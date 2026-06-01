import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useCallback, useId, useState, type MouseEvent } from "react";
import { useRaidTrackerContext } from "../../hooks/use-raid-tracker-context.ts";

export function TrackerControls() {
  const tracker = useRaidTrackerContext();
  const showAddFromTemplate = tracker.dungeons.length === 0;
  const resetAllTogglesDisabled = !tracker.canResetAllToggles;

  const theme = useTheme();
  const menuLayout = useMediaQuery(theme.breakpoints.down("md"));
  const menuId = useId();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchor);

  const closeMenu = useCallback(() => setMenuAnchor(null), []);

  const openMenu = useCallback((event: MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  }, []);

  if (menuLayout) {
    return (
      <>
        <IconButton
          size="small"
          color="inherit"
          aria-label="Tracker actions"
          aria-controls={menuOpen ? menuId : undefined}
          aria-haspopup="true"
          aria-expanded={menuOpen}
          onClick={openMenu}
        >
          <MenuIcon fontSize="small" />
        </IconButton>
        <Menu
          id={menuId}
          anchorEl={menuAnchor}
          open={menuOpen}
          onClose={closeMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          {showAddFromTemplate ? (
            <MenuItem
              onClick={() => {
                tracker.handleAddFromTemplate();
                closeMenu();
              }}
            >
              Add from template
            </MenuItem>
          ) : null}
          <MenuItem
            selected={tracker.showCharacterForm}
            onClick={() => {
              tracker.toggleCharacterForm();
              closeMenu();
            }}
          >
            Add character
          </MenuItem>
          <MenuItem
            selected={tracker.showDungeonForm}
            onClick={() => {
              tracker.toggleDungeonForm();
              closeMenu();
            }}
          >
            Add dungeon
          </MenuItem>
          <MenuItem
            disabled={resetAllTogglesDisabled}
            onClick={() => {
              tracker.handleResetAllToggles();
              closeMenu();
            }}
            sx={{ color: resetAllTogglesDisabled ? undefined : "warning.main" }}
          >
            Reset all toggles
          </MenuItem>
        </Menu>
      </>
    );
  }

  return (
    <Box
      component="nav"
      aria-label="Tracker actions"
      sx={{
        display: "flex",
        alignItems: "center",
        flexWrap: "nowrap",
        gap: 1,
        minWidth: 0,
      }}
    >
      {showAddFromTemplate ? (
        <Button
          size="small"
          variant="contained"
          color="secondary"
          onClick={tracker.handleAddFromTemplate}
        >
          Add from template
        </Button>
      ) : null}
      <Button
        size="small"
        variant={tracker.showCharacterForm ? "contained" : "outlined"}
        color="inherit"
        aria-expanded={tracker.showCharacterForm}
        onClick={tracker.toggleCharacterForm}
      >
        Add character
      </Button>
      <Button
        size="small"
        variant={tracker.showDungeonForm ? "contained" : "outlined"}
        color="inherit"
        aria-expanded={tracker.showDungeonForm}
        onClick={tracker.toggleDungeonForm}
      >
        Add dungeon
      </Button>
      <Button
        size="small"
        variant="text"
        color="warning"
        disabled={resetAllTogglesDisabled}
        onClick={tracker.handleResetAllToggles}
      >
        Reset all toggles
      </Button>
    </Box>
  );
}
