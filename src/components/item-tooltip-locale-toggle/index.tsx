import { IconButton, Tooltip, Typography } from "@mui/material";
import { useItemTooltipLocale } from "../../hooks/use-item-tooltip-locale.ts";
import { useTranslation } from "../../i18n/use-translation.ts";

export function ItemTooltipLocaleToggle() {
  const { locale, t } = useTranslation();
  const { toggleLocale } = useItemTooltipLocale();
  const nextLocale = locale === "en" ? "ru" : "en";

  const tooltipTitle =
    locale === "en" ? t("header.localeTooltipEn") : t("header.localeTooltipRu");

  return (
    <Tooltip title={tooltipTitle}>
      <IconButton
        size="small"
        color="inherit"
        onClick={toggleLocale}
        aria-label={t("header.localeAria", {
          locale: locale.toUpperCase(),
          nextLocale: nextLocale.toUpperCase(),
        })}
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
