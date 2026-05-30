import GitHubIcon from "@mui/icons-material/GitHub";
import { IconButton, Tooltip, Typography } from "@mui/material";

const GITHUB_PROFILE_URL = "https://github.com/sergimax";
const AUTHOR_HINT = "by sergimax via cursor";

export function AppVersionLabel() {
  return (
    <Typography
      component="span"
      variant="caption"
      color="text.secondary"
      aria-label={`Version ${__APP_VERSION__}`}
      sx={{
        fontVariantNumeric: "tabular-nums",
        lineHeight: 1,
        display: "inline-block",
        transform: "rotate(0deg)",
        transformOrigin: "center",
      }}
    >
      v.{__APP_VERSION__}
    </Typography>
  );
}

export function AppMetaInfo() {
  return (
    <Tooltip title={AUTHOR_HINT}>
      <IconButton
        component="a"
        href={GITHUB_PROFILE_URL}
        target="_blank"
        rel="noopener noreferrer"
        size="small"
        color="inherit"
        aria-label={AUTHOR_HINT}
      >
        <GitHubIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
