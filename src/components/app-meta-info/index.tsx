import GitHubIcon from "@mui/icons-material/GitHub";
import { IconButton, Tooltip, Typography } from "@mui/material";
import { useTranslation } from "../../i18n/use-translation.ts";

const GITHUB_REPO_URL = "https://github.com/sergimax/my-raid-cds";

export function AppVersionLabel() {
  const { t } = useTranslation();

  return (
    <Typography
      component="span"
      variant="caption"
      color="text.secondary"
      aria-label={t("header.versionAria", { version: __APP_VERSION__ })}
      sx={{
        fontVariantNumeric: "tabular-nums",
        lineHeight: 1,
        display: "inline-block",
      }}
    >
      v.{__APP_VERSION__}
    </Typography>
  );
}

export function AppMetaInfo() {
  const { t } = useTranslation();
  const authorHint = t("header.authorHint");

  return (
    <Tooltip title={authorHint}>
      <IconButton
        component="a"
        href={GITHUB_REPO_URL}
        target="_blank"
        rel="noopener noreferrer"
        size="small"
        color="inherit"
        aria-label={authorHint}
      >
        <GitHubIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
