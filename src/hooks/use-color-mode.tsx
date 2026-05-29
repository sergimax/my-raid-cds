import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { PaletteMode } from "@mui/material";

const COLOR_MODE_STORAGE_KEY = "my-raid-cds-color-mode";

export type ColorMode = PaletteMode;

type ColorModeContextValue = {
  mode: ColorMode;
  setMode: (mode: ColorMode) => void;
  toggleMode: () => void;
  isDark: boolean;
};

const ColorModeContext = createContext<ColorModeContextValue | null>(null);

function readStoredColorMode(): ColorMode | null {
  try {
    const raw = localStorage.getItem(COLOR_MODE_STORAGE_KEY);
    if (raw === "light" || raw === "dark") {
      return raw;
    }
  } catch {
    // ignore quota / private mode
  }
  return null;
}

function getSystemColorMode(): ColorMode {
  if (typeof window === "undefined") {
    return "light";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getInitialColorMode(): ColorMode {
  return readStoredColorMode() ?? getSystemColorMode();
}

if (typeof document !== "undefined") {
  document.documentElement.dataset.colorMode = getInitialColorMode();
}

export function ColorModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ColorMode>(() => getInitialColorMode());

  useEffect(() => {
    document.documentElement.dataset.colorMode = mode;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", mode === "dark" ? "#18181b" : "#f4f4f5");
    try {
      localStorage.setItem(COLOR_MODE_STORAGE_KEY, mode);
    } catch {
      // ignore
    }
  }, [mode]);

  const setMode = useCallback((nextMode: ColorMode) => {
    setModeState(nextMode);
  }, []);

  const toggleMode = useCallback(() => {
    setModeState((previous) => (previous === "light" ? "dark" : "light"));
  }, []);

  const value = useMemo<ColorModeContextValue>(
    () => ({
      mode,
      setMode,
      toggleMode,
      isDark: mode === "dark",
    }),
    [mode, setMode, toggleMode],
  );

  return <ColorModeContext.Provider value={value}>{children}</ColorModeContext.Provider>;
}

export function useColorMode(): ColorModeContextValue {
  const context = useContext(ColorModeContext);
  if (!context) {
    throw new Error("useColorMode must be used within ColorModeProvider");
  }
  return context;
}
