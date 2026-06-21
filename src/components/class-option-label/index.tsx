import { Box, Stack, Typography } from "@mui/material";
import { characterNameDisplaySx } from "../../utils/character-display.ts";
import type { ClassOptionLabelProps } from "./types.ts";

export function ClassOptionLabel({
  characterClass,
  iconSize = 20,
  variant = "body2",
}: ClassOptionLabelProps) {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
      <Box
        component="img"
        src={characterClass.icon}
        alt=""
        width={iconSize}
        height={iconSize}
        sx={{ borderRadius: "4px", flexShrink: 0 }}
      />
      <Typography
        component="span"
        variant={variant}
        sx={characterNameDisplaySx(characterClass)}
      >
        {characterClass.name}
      </Typography>
    </Stack>
  );
}
