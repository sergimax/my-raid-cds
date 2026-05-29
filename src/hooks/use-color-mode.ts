/**
 * Hook to read/update color mode from ColorModeProvider.
 *
 * Used by ThemeModeToggle and AppThemeProvider (MUI createAppTheme).
 * Must live in .ts (not the provider .tsx) for react-refresh rules.
 */
import { useContext } from "react";
import { ColorModeContext, type ColorModeContextValue } from "./color-mode.ts";

export type { ColorMode } from "./color-mode.ts";

export function useColorMode(): ColorModeContextValue {
  const context = useContext(ColorModeContext);
  if (!context) {
    throw new Error("useColorMode must be used within ColorModeProvider");
  }
  return context;
}
