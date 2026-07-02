import { Box, Stack, Tooltip, Typography } from "@mui/material";
import { getGearSlotIcon } from "../../assets/gear-slot-icons/gear-slot-icons.ts";
import { getLocalizedGearSlotLabel } from "../../i18n/localized-domain.ts";
import { useTranslation } from "../../i18n/use-translation.ts";

export type GearSlotIconProps = {
  slot: number;
  iconSize?: number;
  /** Show localized slot label beside the icon (default true). */
  showLabel?: boolean;
};

export function GearSlotIcon({
  slot,
  iconSize = 28,
  showLabel = true,
}: GearSlotIconProps) {
  const { locale } = useTranslation();
  const slotLabel = getLocalizedGearSlotLabel(slot, locale);
  const iconSrc = getGearSlotIcon(slot);

  if (!iconSrc) {
    return (
      <Typography
        variant="caption"
        component="span"
        sx={{ fontWeight: 600, color: "text.secondary", lineHeight: 1.3 }}
      >
        {slotLabel}
      </Typography>
    );
  }

  const icon = (
    <Box
      component="img"
      src={iconSrc}
      alt=""
      width={iconSize}
      height={iconSize}
      sx={{
        borderRadius: "4px",
        flexShrink: 0,
      }}
    />
  );

  if (!showLabel) {
    return (
      <Tooltip title={slotLabel}>
        <Box component="span" sx={{ display: "inline-flex", lineHeight: 0 }}>
          {icon}
        </Box>
      </Tooltip>
    );
  }

  return (
    <Stack
      direction="row"
      spacing={0.75}
      sx={{ alignItems: "center", minWidth: 0 }}
    >
      {icon}
      <Typography
        variant="caption"
        component="span"
        sx={{
          fontWeight: 600,
          color: "text.secondary",
          lineHeight: 1.3,
          minWidth: 0,
        }}
      >
        {slotLabel}
      </Typography>
    </Stack>
  );
}
