/**
 * Shared color-mode state: context, types, and resolution helpers.
 *
 * Resolution order matches the inline script in index.html:
 * localStorage → prefers-color-scheme → "light".
 *
 * Kept separate from the provider/hook so Fast Refresh can treat
 * contexts/color-mode-provider.tsx as components-only.
 */
import { createContext } from "react";
import type { PaletteMode } from "@mui/material";

/** Same key as index.html pre-paint script (my-raid-cds-color-mode). */
export const COLOR_MODE_STORAGE_KEY = "my-raid-cds-color-mode";

export type ColorMode = PaletteMode;

export type ColorModeContextValue = {
  mode: ColorMode;
  setMode: (mode: ColorMode) => void;
  toggleMode: () => void;
  isDark: boolean;
};

export const ColorModeContext = createContext<ColorModeContextValue | null>(null);

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

export function getInitialColorMode(): ColorMode {
  return readStoredColorMode() ?? getSystemColorMode();
}

// Align :root[data-color-mode] CSS vars before React mounts (see index.css).
if (typeof document !== "undefined") {
  document.documentElement.dataset.colorMode = getInitialColorMode();
}
