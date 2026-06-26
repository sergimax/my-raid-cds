import { IconButton, Tooltip, Typography } from "@mui/material";
import { useItemTooltipLocale } from "../../hooks/use-item-tooltip-locale.ts";

export function ItemTooltipLocaleToggle() {
  const { locale, toggleLocale } = useItemTooltipLocale();
  const nextLocale = locale === "en" ? "ru" : "en";

  const tooltipTitle =
    locale === "en"
      ? "Item tooltips: English (Cavern of Time). Click for Russian."
      : "Item tooltips: Russian (WoWRoad). Click for English.";

  return (
    <Tooltip title={tooltipTitle}>
      <IconButton
        size="small"
        color="inherit"
        onClick={toggleLocale}
        aria-label={`Item tooltip language ${locale.toUpperCase()}. Switch to ${nextLocale.toUpperCase()}.`}
      >
        <Typography
          component="span"
          variant="caption"
          sx={{ fontWeight: 700, fontSize: "0.7rem", lineHeight: 1 }}
        >
          {locale.toUpperCase()}
        </Typography>
      </IconButton>
    </Tooltip>
  );
}
