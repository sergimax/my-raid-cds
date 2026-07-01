import { Alert, Box, Typography } from "@mui/material";
import type { GearHintCellDisplay } from "../../utils/gear-upgrade-hint.ts";
import { useTranslation } from "../../i18n/use-translation.ts";
import { getGearHintKindColor } from "../../utils/gear-hint-display.ts";

type GearHintLegendProps = {
  onDismiss: () => void;
};

function GearHintKindLegendItem({
  hintKind,
  labelKey,
  meaningKey,
}: {
  hintKind: GearHintCellDisplay["kind"];
  labelKey: "gearHint.kindLabelBis" | "gearHint.kindLabelUpgrades";
  meaningKey: "gearHint.legendBisMeaning" | "gearHint.legendUpgradesMeaning";
}) {
  const { t } = useTranslation();

  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        flexWrap: "wrap",
      }}
    >
      <Box
        component="span"
        aria-hidden
        sx={(theme) => ({
          width: 8,
          height: 8,
          borderRadius: "50%",
          flexShrink: 0,
          bgcolor: getGearHintKindColor(hintKind, theme),
        })}
      />
      <Box component="span" sx={{ fontWeight: 700 }}>
        {t(labelKey)}
      </Box>
      <Typography component="span" variant="caption" color="text.secondary">
        = {t(meaningKey)}
      </Typography>
    </Box>
  );
}

export function GearHintLegend({ onDismiss }: GearHintLegendProps) {
  const { t } = useTranslation();

  return (
    <Alert
      variant="outlined"
      severity="info"
      icon={false}
      onClose={onDismiss}
      slotProps={{
        closeButton: {
          "aria-label": t("gearHint.legendDismissAria"),
        },
      }}
      sx={{
        py: 0.25,
        "& .MuiAlert-message": {
          py: 0.25,
          width: "100%",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 0.75,
          rowGap: 0.25,
        }}
      >
        <GearHintKindLegendItem
          hintKind="bis"
          labelKey="gearHint.kindLabelBis"
          meaningKey="gearHint.legendBisMeaning"
        />
        <Typography component="span" variant="caption" color="text.secondary" aria-hidden>
          ·
        </Typography>
        <GearHintKindLegendItem
          hintKind="ilvl"
          labelKey="gearHint.kindLabelUpgrades"
          meaningKey="gearHint.legendUpgradesMeaning"
        />
      </Box>
    </Alert>
  );
}
