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
          {showAddFromTemplate && onAddFromTemplate ? (
            <MenuItem
              onClick={() => {
                onAddFromTemplate();
                closeMenu();
              }}
            >
              Add from template
            </MenuItem>
          ) : null}
          <MenuItem
            selected={showCharacterForm}
            onClick={() => {
              onToggleCharacterForm();
              closeMenu();
            }}
          >
            Add character
          </MenuItem>
          <MenuItem
            selected={showDungeonForm}
            onClick={() => {
              onToggleDungeonForm();
              closeMenu();
            }}
          >
            Add dungeon
          </MenuItem>
          <MenuItem
            disabled={resetAllTogglesDisabled}
            onClick={() => {
              onResetAllToggles();
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
      >
        Add character
      </Button>
      <Button
        size="small"
        variant={showDungeonForm ? "contained" : "outlined"}
        color="inherit"
        aria-expanded={showDungeonForm}
        onClick={onToggleDungeonForm}
      >
        Add dungeon
      </Button>
      <Button
        size="small"
        variant="text"
        color="warning"
        disabled={resetAllTogglesDisabled}
        onClick={onResetAllToggles}
      >
        Reset all toggles
      </Button>
    </Box>
  );
}
