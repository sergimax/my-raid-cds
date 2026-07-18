import { Box, Tooltip } from "@mui/material";
import type { ReactNode } from "react";

/** Wraps children in a tooltip only when a title is provided. */
export function InactiveSpecTooltip({
  title,
  children,
}: {
  title: string | null;
  children: ReactNode;
}) {
  if (!title) {
    return <>{children}</>;
  }

  return (
    <Tooltip title={title}>
      <Box component="span" sx={{ display: "inline-flex", minWidth: 0, width: "100%" }}>
        {children}
      </Box>
    </Tooltip>
  );
}
