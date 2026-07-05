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
    <Stack spacing={0.75} sx={{ minWidth: 0 }}>
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
          <Typography variant="body2" component="span">
            {t("exportPanel.minGearScoreEnable")}
          </Typography>
        }
        sx={{ mr: 0, alignSelf: "flex-start" }}
      />
      <Stack spacing={0.5} sx={{ pl: 0.5, minWidth: 0 }}>
        <Slider
          disabled={!enabled}
          min={EXPORT_MIN_GS_COMPACT_MIN}
          max={EXPORT_MIN_GS_COMPACT_MAX}
          step={EXPORT_MIN_GS_COMPACT_STEP}
          value={compactValue}
          onChange={(_event, nextValue) => {
            onCompactValueChange(nextValue as number);
          }}
          valueLabelDisplay="off"
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
          sx={{ width: "100%", mx: 0.5 }}
        />
        <Typography
          component="p"
          color={enabled ? "text.primary" : "text.disabled"}
          sx={{
            textAlign: "center",
            fontVariantNumeric: "tabular-nums",
            fontSize: "1.35rem",
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: "0.01em",
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
