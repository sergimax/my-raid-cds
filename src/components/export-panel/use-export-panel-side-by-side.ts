import { useMediaQuery } from "@mui/material";
import { EXPORT_PANEL_SIDE_BY_SIDE_MQ } from "./constants.ts";

export function useExportPanelSideBySide(): boolean {
  return useMediaQuery(EXPORT_PANEL_SIDE_BY_SIDE_MQ);
}
