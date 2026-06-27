import { Typography } from "@mui/material";
import { useTranslation } from "../../i18n/use-translation.ts";
import type { AppIntroProps } from "./types.ts";

export function AppIntro({ visible = true }: AppIntroProps) {
  const { t } = useTranslation();

  if (!visible) {
    return null;
  }

  return (
    <Typography color="text.secondary" variant="body1">
      {t("intro.body")}{" "}
      <strong>{t("intro.addFromTemplate")}</strong> {t("intro.bodySuffix")}
    </Typography>
  );
}
