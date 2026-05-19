import { Typography } from "@mui/material";
import type { AppIntroProps } from "./types.ts";

export function AppIntro({ visible = true }: AppIntroProps) {
  if (!visible) {
    return null;
  }

  return (
    <Typography color="text.secondary" variant="body1">
      Self-contained demo: characters and dungeons use shared domain types;
      completion is stored in <code>DungeonToggles</code> (character id →
      dungeon id → boolean). Replace this file when you wire storage and hooks.
    </Typography>
  );
}
