import {
  Checkbox,
  FormControlLabel,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslation } from "../../i18n/use-translation.ts";
import {
  EXPORT_MIN_GS_COMPACT_MAX,
  EXPORT_MIN_GS_COMPACT_MIN,
  EXPORT_MIN_GS_COMPACT_STEP,
  formatCompactExportMinGearScore,
} from "../../utils/parse-export-min-gear-score.ts";

type ExportMinGearScoreFilterProps = {
  enabled: boolean;
  compactValue: number;
  onEnabledChange: (enabled: boolean) => void;
  onCompactValueChange: (compactValue: number) => void;
};

export function ExportMinGearScoreFilter({
  enabled,
  compactValue,
  onEnabledChange,
  onCompactValueChange,
}: ExportMinGearScoreFilterProps) {
  const { t } = useTranslation();
  const compactLabel = formatCompactExportMinGearScore(compactValue);

  return (
    <Stack spacing={0.5} sx={{ minWidth: 0 }}>
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: "center", flexWrap: "wrap", gap: 1 }}
      >
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={enabled}
              onChange={(event) => {
                onEnabledChange(event.target.checked);
              }}
              slotProps={{
                input: {
                  "aria-label": t("exportPanel.minGearScoreEnableAria"),
                },
              }}
            />
          }
          label={
            <Typography variant="body2" component="span" sx={{ whiteSpace: "nowrap" }}>
              {t("exportPanel.minGearScoreEnable")}
            </Typography>
          }
          sx={{ mr: 0, flexShrink: 0 }}
        />
        <Slider
          disabled={!enabled}
          min={EXPORT_MIN_GS_COMPACT_MIN}
          max={EXPORT_MIN_GS_COMPACT_MAX}
          step={EXPORT_MIN_GS_COMPACT_STEP}
          value={compactValue}
          onChange={(_event, nextValue) => {
            onCompactValueChange(nextValue as number);
          }}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) =>
            t("exportPanel.minGearScoreSliderValue", {
              value: formatCompactExportMinGearScore(value),
            })
          }
          getAriaValueText={(value) =>
            t("exportPanel.minGearScoreSliderValue", {
              value: formatCompactExportMinGearScore(value),
            })
          }
          slotProps={{
            input: {
              "aria-label": t("exportPanel.minGearScoreAria"),
            },
          }}
          sx={{ flex: 1, minWidth: 120, mx: 0.5 }}
        />
        <Typography
          variant="body2"
          color={enabled ? "text.primary" : "text.disabled"}
          sx={{
            minWidth: 40,
            textAlign: "right",
            fontVariantNumeric: "tabular-nums",
            flexShrink: 0,
          }}
        >
          {enabled
            ? t("exportPanel.minGearScoreSliderValue", { value: compactLabel })
            : "—"}
        </Typography>
      </Stack>
    </Stack>
  );
}
