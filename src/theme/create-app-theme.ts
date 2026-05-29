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
            text: {
              primary: "#18181b",
              secondary: "#52525b",
            },
          }
        : {
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
  });
}
