import { ThemeProvider } from "@mui/material/styles";
import type { ReactNode } from "react";
import { createAppTheme } from "../theme/create-app-theme.ts";

export function TestProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={createAppTheme("light")}>{children}</ThemeProvider>
  );
}
