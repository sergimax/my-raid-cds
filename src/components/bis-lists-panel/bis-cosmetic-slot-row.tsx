import { Box, Stack, Typography } from "@mui/material";
import { getCosmeticGearSlotIcon } from "../../assets/gear-slot-icons/gear-slot-icons.ts";
import type { BisPaperDollCosmeticId } from "../../data/bis-paper-doll-slots.ts";
import { useTranslation } from "../../i18n/use-translation.ts";

type BisCosmeticSlotRowProps = {
  cosmeticId: BisPaperDollCosmeticId;
  iconSize?: number;
};

/** Non-editable shirt/tabard placeholders to match the in-game paper doll. */
export function BisCosmeticSlotRow({
  cosmeticId,
  iconSize = 28,
}: BisCosmeticSlotRowProps) {
  const { t } = useTranslation();
  const label =
    cosmeticId === "shirt"
      ? t("bisPanel.shirtSlot")
      : t("bisPanel.tabardSlot");
  const iconSrc = getCosmeticGearSlotIcon(cosmeticId);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "6.25rem minmax(0, 1fr) auto",
        columnGap: 1,
        alignItems: "center",
        py: 0.375,
        minHeight: 32,
        opacity: 0.55,
      }}
      aria-hidden
    >
      <Stack
        direction="row"
        spacing={0.75}
        sx={{ alignItems: "center", minWidth: 0 }}
      >
        <Box
          component="img"
          src={iconSrc}
          alt=""
          width={iconSize}
          height={iconSize}
          sx={{ borderRadius: "4px", flexShrink: 0 }}
        />
        <Typography
          variant="caption"
          component="span"
          sx={{
            fontWeight: 600,
            color: "text.secondary",
            lineHeight: 1.3,
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </Typography>
      </Stack>
      <Typography variant="caption" color="text.disabled" sx={{ lineHeight: 1.3 }}>
        {t("bisPanel.cosmeticSlotHint")}
      </Typography>
      <Box />
    </Box>
  );
}
