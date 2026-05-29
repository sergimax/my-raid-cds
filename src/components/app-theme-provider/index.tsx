import { CssBaseline, ThemeProvider } from "@mui/material";
import { useMemo, type ReactNode } from "react";
import { ColorModeProvider } from "../../hooks/color-mode-provider.tsx";
import { useColorMode } from "../../hooks/use-color-mode.ts";
import { createAppTheme } from "../../theme/create-app-theme.ts";

type AppThemeProviderProps = {
  children: ReactNode;
};

function ThemedApp({ children }: AppThemeProviderProps) {
  const { mode } = useColorMode();
  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export function AppThemeProvider({ children }: AppThemeProviderProps) {
  return (
    <ColorModeProvider>
      <ThemedApp>{children}</ThemedApp>
    </ColorModeProvider>
  );
}
