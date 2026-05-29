import type { Theme } from "@mui/material/styles";

export type CompletionChipFill = {
  backgroundColor: string;
  color: string;
};

/** Ratio thresholds: red → orange → amber → yellow → sky → blue → cyan → green. */
const PROGRESS_STOPS: readonly { minRatio: number; backgroundColor: string; color: string }[] =
  [
    { minRatio: 0.001, backgroundColor: "#dc2626", color: "#ffffff" },
    { minRatio: 0.125, backgroundColor: "#ea580c", color: "#ffffff" },
    { minRatio: 0.25, backgroundColor: "#f59e0b", color: "#ffffff" },
    { minRatio: 0.375, backgroundColor: "#eab308", color: "#422006" },
    { minRatio: 0.5, backgroundColor: "#ca8a04", color: "#ffffff" },
    { minRatio: 0.625, backgroundColor: "#0ea5e9", color: "#ffffff" },
    { minRatio: 0.75, backgroundColor: "#2563eb", color: "#ffffff" },
    { minRatio: 0.875, backgroundColor: "#06b6d4", color: "#ffffff" },
    { minRatio: 1, backgroundColor: "#16a34a", color: "#ffffff" },
  ];

function grayFill(theme: Theme): CompletionChipFill {
  const isDark = theme.palette.mode === "dark";
  return {
    backgroundColor: isDark ? theme.palette.grey[700] : theme.palette.grey[400],
    color: isDark ? theme.palette.grey[100] : theme.palette.grey[900],
  };
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
