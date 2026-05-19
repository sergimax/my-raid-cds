import { Typography } from "@mui/material";
import type { AppIntroProps } from "./types.ts";

export function AppIntro({ visible = true }: AppIntroProps) {
  if (!visible) {
    return null;
  }

  return (
    <Typography color="text.secondary" variant="body1">
      Add characters and dungeons, then mark cooldown usage per cell. Data is
      saved automatically in your browser. When the dungeon list is empty, use{" "}
      <strong>Add from template</strong> to load WotLK raids (Russian names).
    </Typography>
  );
}
