import { createTheme, type PaletteMode } from "@mui/material/styles";

const fontFamily = [
  "system-ui",
  "-apple-system",
  "BlinkMacSystemFont",
  '"Segoe UI"',
  "Roboto",
  "Helvetica",
  "Arial",
  "sans-serif",
].join(",");

export function createAppTheme(mode: PaletteMode) {
  return createTheme({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            background: {
              default: "#f4f4f5",
              paper: "#ffffff",
            },
            info: {
              main: "#0284c7",
              light: "#38bdf8",
              dark: "#0369a1",
            },
            warning: {
              main: "#d97706",
              light: "#fbbf24",
              dark: "#b45309",
            },
            text: {
              primary: "#18181b",
              secondary: "#52525b",
            },
          }
        : {
            primary: {
              main: "#60a5fa",
              light: "#93c5fd",
              dark: "#2563eb",
            },
            info: {
              main: "#38bdf8",
              light: "#7dd3fc",
              dark: "#0284c7",
            },
            warning: {
              main: "#f59e0b",
              light: "#fbbf24",
              dark: "#d97706",
            },
            background: {
              default: "#18181b",
              paper: "#27272a",
            },
            text: {
              primary: "#fafafa",
              secondary: "#a1a1aa",
            },
          }),
    },
    typography: {
      fontFamily,
    },
    shape: { borderRadius: 8 },
    components: {
      MuiSwitch: {
        styleOverrides: {
          switchBase: ({ theme }) =>
            theme.palette.mode === "dark"
              ? {
                  color: "#52525b",
                  "& + .MuiSwitch-track": {
                    backgroundColor: "#27272a",
                    opacity: 1,
                  },
                  "&.Mui-checked": {
                    color: "#ffffff",
                    "& + .MuiSwitch-track": {
                      backgroundColor: theme.palette.primary.main,
                      opacity: 1,
                    },
                  },
                }
              : {},
        },
      },
    },
  });
}
