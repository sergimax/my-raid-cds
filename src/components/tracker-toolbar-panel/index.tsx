import { Box } from "@mui/material";
import type { ReactNode } from "react";
import { useScrollToTopOnPanelOpen } from "../../hooks/use-scroll-to-top-on-panel-open.ts";

type TrackerToolbarPanelProps = {
  panelId: string;
  children: ReactNode;
};

/** Shared mount slot for header toolbar panels (scroll to top on open/switch). */
export function TrackerToolbarPanel({ panelId, children }: TrackerToolbarPanelProps) {
  useScrollToTopOnPanelOpen(panelId);

  return <Box data-toolbar-panel={panelId}>{children}</Box>;
}

export { resolveMainToolbarPanelId } from "./resolve-toolbar-panel-id.ts";
export type { MainToolbarPanelId } from "./resolve-toolbar-panel-id.ts";
