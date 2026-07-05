import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { getRaidIcon } from "../../assets/raid-icons/raid-icons.ts";
import type { RaidKey } from "../../data/raid-names.ts";

const defaultRaidIconSx: SxProps<Theme> = {
  width: 18,
  height: 18,
  flexShrink: 0,
  display: "block",
  borderRadius: "4px",
  objectFit: "contain",
};

type ExportRaidIconProps = {
  raidKey: RaidKey | undefined;
  size?: number;
  sx?: SxProps<Theme>;
};

export function ExportRaidIcon({ raidKey, size = 18, sx }: ExportRaidIconProps) {
  const iconSrc = getRaidIcon(raidKey);
  if (!iconSrc) {
    return null;
  }

  return (
    <Box
      component="img"
      src={iconSrc}
      alt=""
      sx={{
        ...defaultRaidIconSx,
        width: size,
        height: size,
        ...sx,
      }}
    />
  );
}
