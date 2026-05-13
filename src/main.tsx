import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import "./index.css";
import App from "./App.tsx";

const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#f4f4f5",
      paper: "#ffffff",
    },
    text: {
      primary: "#18181b",
      secondary: "#52525b",
    },
  },
  typography: {
    fontFamily: [
      "system-ui",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      "Helvetica",
      "Arial",
      "sans-serif",
    ].join(","),
  },
  shape: { borderRadius: 8 },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
);
