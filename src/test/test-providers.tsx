import { ThemeProvider } from "@mui/material/styles";
import type { ReactNode } from "react";
import { BisListsProvider } from "../contexts/bis-lists-provider.tsx";
import { createAppTheme } from "../theme/create-app-theme.ts";

export function TestProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={createAppTheme("light")}>
      <BisListsProvider>{children}</BisListsProvider>
    </ThemeProvider>
  );
}
