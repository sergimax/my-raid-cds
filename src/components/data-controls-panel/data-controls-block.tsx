import { Box } from "@mui/material";
import type { ReactNode } from "react";
import type { DataControlsGridAreaId } from "./constants.ts";

type DataControlsBlockProps = {
  gridArea: DataControlsGridAreaId;
  children: ReactNode;
};

export function DataControlsBlock({
  gridArea,
  children,
}: DataControlsBlockProps) {
  return (
    <Box
      sx={{
        gridArea: { xs: "auto", sm: gridArea },
        minWidth: 0,
        minHeight: 0,
        display: "flex",
        height: { xs: "auto", sm: "100%" },
        overflow: { xs: "visible", sm: "hidden" },
        maxWidth: { xs: "100%", sm: "none" },
        "& > *": {
          flex: 1,
          minHeight: 0,
          width: "100%",
        },
      }}
    >
      {children}
    </Box>
  );
}
