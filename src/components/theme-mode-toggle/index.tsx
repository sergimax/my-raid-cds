import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { IconButton, Tooltip } from "@mui/material";
import { useColorMode } from "../../hooks/use-color-mode.ts";
import { useTranslation } from "../../i18n/use-translation.ts";

export function ThemeModeToggle() {
  const { mode, toggleMode } = useColorMode();
  const { t } = useTranslation();
  const isDark = mode === "dark";
  const label = isDark ? t("header.themeLight") : t("header.themeDark");

  return (
    <Tooltip title={label}>
      <IconButton
        size="small"
        color="inherit"
        onClick={toggleMode}
        aria-label={label}
      >
        {isDark ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
      </IconButton>
    </Tooltip>
  );
}
