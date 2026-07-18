import { Typography } from "@mui/material";

type CharacterSpecListNameProps = {
  name: string;
  inactive?: boolean;
  /** Cooldown = italic/disabled; filters = muted (Character pick only). */
  inactiveTone?: "cooldown" | "filters";
};

/** Truncating name cell shared by Character pick and Soft pick spec lists. */
export function CharacterSpecListName({
  name,
  inactive = false,
  inactiveTone = "cooldown",
}: CharacterSpecListNameProps) {
  const color =
    !inactive
      ? "text.primary"
      : inactiveTone === "filters"
        ? "text.secondary"
        : "text.disabled";

  return (
    <Typography
      variant="body2"
      title={name}
      sx={{
        fontWeight: inactive ? 500 : 600,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        minWidth: 0,
        color,
        fontStyle: inactive && inactiveTone === "cooldown" ? "italic" : "normal",
      }}
    >
      {name}
    </Typography>
  );
}
