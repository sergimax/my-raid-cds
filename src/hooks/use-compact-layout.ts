import { useMediaQuery, useTheme } from "@mui/material";

/** Below `md`: toolbar menu layout and compact raid tracker table columns. */
export function useCompactLayout(): boolean {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down("md"));
}
