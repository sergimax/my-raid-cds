import MenuIcon from "@mui/icons-material/Menu";
import { Box, IconButton, Menu } from "@mui/material";
import { memo, useCallback, useId, useMemo, useState, type MouseEvent } from "react";
import { useCompactLayout } from "../../hooks/use-compact-layout.ts";
import { buildTrackerActions } from "./actions.ts";
import { renderTrackerAction } from "./render-tracker-action.tsx";
import type { TrackerControlsSource } from "./types.ts";

type TrackerControlsProps = {
  source: TrackerControlsSource;
};

export const TrackerControls = memo(function TrackerControls({
  source,
}: TrackerControlsProps) {
  const actions = useMemo(() => buildTrackerActions(source), [source]);

  const menuLayout = useCompactLayout();
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
          {actions.map((action) =>
            renderTrackerAction(action, "menuItem", { onAfterClick: closeMenu }),
          )}
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
      {actions.map((action) => renderTrackerAction(action, "button"))}
    </Box>
  );
});
