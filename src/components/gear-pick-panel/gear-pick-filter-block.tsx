import { Box } from "@mui/material";
import type { ReactNode } from "react";
import {
  GEAR_PICK_SIDE_BY_SIDE_MQ_KEY,
  type GearPickGridAreaId,
} from "./constants.ts";

type GearPickFilterBlockProps = {
  gridArea: GearPickGridAreaId;
  children: ReactNode;
  /**
   * Size to content from md until the wide breakpoint (copy row under softs).
   * At ≥1600px still fills the 2-row grid area.
   */
  contentSizedUntilWide?: boolean;
};

/** Positions a Soft pick panel region in the responsive grid. */
export function GearPickFilterBlock({
  gridArea,
  children,
  contentSizedUntilWide = false,
}: GearPickFilterBlockProps) {
  return (
    <Box
      sx={{
        gridArea: { xs: "auto", md: gridArea },
        minWidth: 0,
        minHeight: 0,
        display: "flex",
        height: contentSizedUntilWide
          ? { xs: "auto", md: "auto" }
          : { xs: "auto", md: "100%" },
        overflow: contentSizedUntilWide
          ? { xs: "visible", md: "visible" }
          : { xs: "visible", md: "hidden" },
        maxWidth: { xs: "100%", md: "none" },
        "& > *": {
          flex: 1,
          minHeight: 0,
          width: "100%",
        },
        ...(contentSizedUntilWide
          ? {
              [GEAR_PICK_SIDE_BY_SIDE_MQ_KEY]: {
                height: "100%",
                overflow: "hidden",
              },
            }
          : null),
      }}
    >
      {children}
    </Box>
  );
}
