import { Box } from "@mui/material";
import type { ReactNode } from "react";
import type { ExportFilterGridAreaId } from "./constants.ts";

type ExportFilterBlockProps = {
  gridArea: ExportFilterGridAreaId;
  children: ReactNode;
};

export function ExportFilterBlock({ gridArea, children }: ExportFilterBlockProps) {
  return (
    <Box
      sx={{
        gridArea: { xs: "auto", md: gridArea },
        minWidth: 0,
        minHeight: 0,
        display: "flex",
        maxWidth: { xs: "100%", md: "none" },
      }}
    >
      {children}
    </Box>
  );
}
