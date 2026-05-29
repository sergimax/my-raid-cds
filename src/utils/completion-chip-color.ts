import type { Theme } from "@mui/material/styles";

export type CompletionChipFill = {
  backgroundColor: string;
  color: string;
};

const DARK_TEXT = "#422006";

/**
 * Ratio thresholds: gray (none) → red → orange → amber/yellow → gold → sky → blue → cyan → green.
 * Pairs target WCAG AA contrast (≥4.5:1) for small chip labels.
 */
const PROGRESS_STOPS: readonly { minRatio: number; backgroundColor: string; color: string }[] =
  [
    { minRatio: 0.001, backgroundColor: "#dc2626", color: "#ffffff" },
    { minRatio: 0.125, backgroundColor: "#c2410c", color: "#ffffff" },
    { minRatio: 0.25, backgroundColor: "#f59e0b", color: DARK_TEXT },
    { minRatio: 0.375, backgroundColor: "#eab308", color: DARK_TEXT },
    { minRatio: 0.5, backgroundColor: "#a16207", color: "#ffffff" },
    { minRatio: 0.625, backgroundColor: "#0369a1", color: "#ffffff" },
    { minRatio: 0.75, backgroundColor: "#2563eb", color: "#ffffff" },
    { minRatio: 0.875, backgroundColor: "#0e7490", color: "#ffffff" },
    { minRatio: 1, backgroundColor: "#15803d", color: "#ffffff" },
  ];

function grayFill(theme: Theme): CompletionChipFill {
  return theme.palette.mode === "dark"
    ? { backgroundColor: "#52525b", color: "#fafafa" }
    : { backgroundColor: "#9ca3af", color: "#111827" };
}

function progressFill(ratio: number): CompletionChipFill {
  const clamped = Math.min(Math.max(ratio, 0), 1);
  let fill: CompletionChipFill = {
    backgroundColor: PROGRESS_STOPS[0].backgroundColor,
    color: PROGRESS_STOPS[0].color,
  };

  for (const stop of PROGRESS_STOPS) {
    if (clamped >= stop.minRatio) {
      fill = { backgroundColor: stop.backgroundColor, color: stop.color };
    }
  }

  return fill;
}

/** Filled chip colors: gray (none) → red … yellow … blue … green (complete). */
export function completionChipFill(
  completed: number,
  total: number,
  theme: Theme,
): CompletionChipFill {
  if (total <= 0 || completed <= 0) {
    return grayFill(theme);
  }

  const ratio = completed / total;
  if (ratio >= 1) {
    return {
      backgroundColor: PROGRESS_STOPS[PROGRESS_STOPS.length - 1].backgroundColor,
      color: PROGRESS_STOPS[PROGRESS_STOPS.length - 1].color,
    };
  }

  return progressFill(ratio);
}
