import type { ReactNode } from "react";
import { Stack, Typography } from "@mui/material";

export type AppHeaderProps = {
  actions?: ReactNode;
};

export function AppHeader({ actions }: AppHeaderProps) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={1.5}
      sx={{
        alignItems: { xs: "stretch", sm: "center" },
        justifyContent: "space-between",
        gap: 1.5,
      }}
    >
      <Typography component="h1" variant="h4">
        My Raid CDs
      </Typography>
      {actions ? <div>{actions}</div> : null}
    </Stack>
  );
}
