import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material";
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
      <Container maxWidth={false} disableGutters sx={{ px: { xs: 2, sm: 3 } }}>
        <Toolbar disableGutters sx={{ gap: 2, minHeight: { xs: 56, sm: 64 } }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexShrink: 0,
              mr: 1,
            }}
          >
            <Typography component="h1" variant="h6" noWrap>
              My Raid CDs
            </Typography>
            <AppVersionLabel />
          </Box>

          {center ? (
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
                minWidth: 0,
              }}
            >
              {center}
            </Box>
          ) : null}

          <Box
            sx={{
              flexGrow: 0,
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <ThemeModeToggle />
            <AppMetaInfo />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
