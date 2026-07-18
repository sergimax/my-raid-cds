import { Box } from "@mui/material";
import type { ReactNode } from "react";

/** Main/off control cell in the shared character-spec list grid. */
export function SpecCell({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", minWidth: 0 }}>{children}</Box>
  );
}
