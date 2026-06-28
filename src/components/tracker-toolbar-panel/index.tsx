import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import type { ReactNode } from "react";
import { useScrollToTopOnPanelOpen } from "../../hooks/use-scroll-to-top-on-panel-open.ts";

export type TrackerToolbarPanelProps = {
  panelId: string;
  title: string;
  description?: string;
  descriptionTooltip?: string;
  closeAriaLabel: string;
  onClose: () => void;
  children: ReactNode;
};

/** Shared shell for header toolbar panels (outlined card, title, optional hint, close icon). */
export function TrackerToolbarPanel({
  panelId,
  title,
  description,
  descriptionTooltip,
  closeAriaLabel,
  onClose,
  children,
}: TrackerToolbarPanelProps) {
  useScrollToTopOnPanelOpen(panelId);

  const descriptionNode = description ? (
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{
        display: "block",
        lineHeight: 1.35,
        cursor: descriptionTooltip ? "help" : undefined,
      }}
    >
      {description}
    </Typography>
  ) : null;

  return (
    <Paper
      variant="outlined"
      data-toolbar-panel={panelId}
      sx={{ p: { xs: 1.25, sm: 1.5 } }}
    >
      <Stack spacing={1.25}>
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: "flex-start", justifyContent: "space-between" }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
              {title}
            </Typography>
            {descriptionNode && descriptionTooltip ? (
              <Tooltip title={descriptionTooltip} placement="bottom-start">
                {descriptionNode}
              </Tooltip>
            ) : (
              descriptionNode
            )}
          </Box>
          <IconButton
            size="small"
            aria-label={closeAriaLabel}
            onClick={onClose}
            sx={{ mt: -0.25, mr: -0.5 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
        {children}
      </Stack>
    </Paper>
  );
}

export { resolveMainToolbarPanelId } from "./resolve-toolbar-panel-id.ts";
export type { MainToolbarPanelId } from "./resolve-toolbar-panel-id.ts";
