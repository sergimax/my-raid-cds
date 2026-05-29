import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { AppMetaInfo, AppVersionLabel } from "../app-meta-info/index.tsx";
import { ThemeModeToggle } from "../theme-mode-toggle/index.tsx";
import type { AppHeaderProps } from "./types.ts";

export type { AppHeaderProps } from "./types.ts";

export function AppHeader({ center }: AppHeaderProps) {
  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        bgcolor: "background.default",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          px: { xs: 2, sm: 3 },
          py: 1,
          gap: 1.5,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "baseline",
            gap: 0.75,
            flexShrink: 0,
          }}
        >
          <Typography component="h1" variant="h5">
            My Raid CDs
          </Typography>
          <AppVersionLabel />
        </Box>
        {center ? (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 1,
            }}
          >
            {center}
          </Box>
        ) : null}
        <Box
          sx={{
            ml: "auto",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            gap: 0.25,
          }}
        >
          <ThemeModeToggle />
          <AppMetaInfo />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
