import { alpha, createTheme, type PaletteMode } from "@mui/material/styles";
import { getTooltipSurface } from "./tooltip-surface.ts";

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
  const isLight = mode === "light";

  return createTheme({
    palette: {
      mode,
      ...(isLight
        ? {
            primary: {
              main: "#2563eb",
              light: "#60a5fa",
              dark: "#1d4ed8",
            },
            secondary: {
              main: "#0f766e",
              light: "#14b8a6",
              dark: "#0d5c56",
            },
            background: {
              default: "#f1f5f9",
              paper: "#ffffff",
            },
            divider: "#e2e8f0",
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
              primary: "#0f172a",
              secondary: "#64748b",
            },
            action: {
              hover: alpha("#0f172a", 0.04),
              selected: alpha("#2563eb", 0.08),
            },
          }
        : {
            primary: {
              main: "#60a5fa",
              light: "#93c5fd",
              dark: "#2563eb",
            },
            secondary: {
              main: "#2dd4bf",
              light: "#5eead4",
              dark: "#14b8a6",
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
              default: "#0f172a",
              paper: "#1e293b",
            },
            divider: "#334155",
            text: {
              primary: "#f8fafc",
              secondary: "#94a3b8",
            },
            action: {
              hover: alpha("#f8fafc", 0.06),
              selected: alpha("#60a5fa", 0.16),
            },
          }),
    },
    typography: {
      fontFamily,
      button: {
        textTransform: "none",
        fontWeight: 600,
        letterSpacing: 0,
      },
      h6: {
        fontWeight: 700,
        letterSpacing: "-0.02em",
      },
      subtitle1: {
        fontWeight: 600,
        letterSpacing: "-0.01em",
      },
    },
    shape: { borderRadius: 10 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundImage: isLight
              ? "radial-gradient(1200px 600px at 10% -10%, rgba(37, 99, 235, 0.07), transparent 55%), radial-gradient(900px 500px at 100% 0%, rgba(15, 118, 110, 0.05), transparent 50%)"
              : "radial-gradient(1000px 520px at 8% -12%, rgba(96, 165, 250, 0.12), transparent 55%), radial-gradient(800px 480px at 100% 0%, rgba(45, 212, 191, 0.08), transparent 50%)",
            backgroundAttachment: "fixed",
          },
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: 8,
            paddingInline: 12,
          },
          sizeSmall: {
            paddingBlock: 4,
            paddingInline: 10,
          },
          outlined: ({ theme }) => ({
            borderColor: theme.palette.divider,
            backgroundColor: alpha(theme.palette.background.paper, isLight ? 0.7 : 0.4),
            "&:hover": {
              borderColor: theme.palette.mode === "light" ? "#cbd5e1" : "#475569",
              backgroundColor: theme.palette.action.hover,
            },
          }),
        },
        variants: [
          {
            props: { variant: "contained", color: "inherit" },
            style: ({ theme }) => ({
              backgroundColor: isLight
                ? alpha(theme.palette.common.black, 0.06)
                : alpha(theme.palette.common.white, 0.1),
              color: theme.palette.text.primary,
              "&:hover": {
                backgroundColor: isLight
                  ? alpha(theme.palette.common.black, 0.1)
                  : alpha(theme.palette.common.white, 0.16),
              },
            }),
          },
        ],
      },
      MuiIconButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 8,
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          }),
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
          outlined: ({ theme }) => ({
            borderColor: theme.palette.divider,
            boxShadow: isLight
              ? "0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.06)"
              : "0 1px 2px rgba(0, 0, 0, 0.35)",
          }),
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 10,
          },
          outlined: ({ theme }) => ({
            backgroundColor: alpha(theme.palette.background.paper, isLight ? 0.85 : 0.55),
          }),
        },
      },
      MuiTableContainer: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: theme.shape.borderRadius,
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
            boxShadow: isLight
              ? "0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.06)"
              : "0 1px 2px rgba(0, 0, 0, 0.35)",
          }),
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: ({ theme }) => ({
            backgroundColor: alpha(
              theme.palette.background.paper,
              isLight ? 0.92 : 0.88,
            ),
            backdropFilter: "blur(8px)",
            borderBottomColor: theme.palette.divider,
            fontWeight: 600,
          }),
          body: ({ theme }) => ({
            borderBottomColor: alpha(theme.palette.divider, 0.7),
          }),
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: ({ theme }) => ({
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
            "&:last-of-type .MuiTableCell-body": {
              borderBottom: 0,
            },
          }),
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: ({ theme }) => ({
            borderRadius: 12,
            border: `1px solid ${theme.palette.divider}`,
          }),
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: ({ theme }) => {
            const surface = getTooltipSurface(theme.palette.mode);
            return {
              bgcolor: surface.bgcolor,
              color: surface.color,
              border: `1px solid ${surface.borderColor}`,
              boxShadow: theme.shadows[theme.palette.mode === "light" ? 8 : 12],
              borderRadius: 8,
            };
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          switchBase: ({ theme }) =>
            theme.palette.mode === "dark"
              ? {
                  color: "#64748b",
                  "& + .MuiSwitch-track": {
                    backgroundColor: "#334155",
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
      MuiOutlinedInput: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: alpha(theme.palette.background.paper, isLight ? 0.8 : 0.35),
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: isLight ? "#cbd5e1" : "#475569",
            },
          }),
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: ({ theme }) => ({
            borderRadius: 10,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: isLight
              ? "0 8px 24px rgba(15, 23, 42, 0.12)"
              : "0 8px 24px rgba(0, 0, 0, 0.45)",
          }),
        },
      },
    },
  });
}
