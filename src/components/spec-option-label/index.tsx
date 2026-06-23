import { Box, Stack, Tooltip, Typography } from "@mui/material";
import { specIconFor } from "../../assets/class-icons/spec-icons.ts";
import type { ClassName, CharacterClass } from "../../types/characters.ts";
import { formatCompactGearScore } from "../../utils/format-character-details.ts";

type SpecOptionLabelProps = {
  className: ClassName;
  spec: string;
  gearScore?: number;
  iconSize?: number;
  variant?: "body2" | "caption" | "inherit";
  color?: "text.secondary" | "inherit";
  /** When false, shows only the spec icon and optional gear score (for compact table headers). */
  showSpecName?: boolean;
};

export function SpecOptionLabel({
  className,
  spec,
  gearScore,
  iconSize = 18,
  variant = "inherit",
  color = "inherit",
  showSpecName = true,
}: SpecOptionLabelProps) {
  const icon = specIconFor(className, spec);
  const gearScoreText =
    gearScore !== undefined ? formatCompactGearScore(gearScore) : undefined;
  const detailLabel =
    gearScoreText !== undefined ? `${spec} · ${gearScoreText}` : spec;

  const content = (
    <Stack
      direction="row"
      spacing={0.5}
      sx={{ alignItems: "center", minWidth: 0 }}
    >
      {icon ? (
        <Box
          component="img"
          src={icon}
          alt={showSpecName ? "" : spec}
          width={iconSize}
          height={iconSize}
          sx={{ borderRadius: "4px", flexShrink: 0 }}
        />
      ) : null}
      {showSpecName ? (
        <Typography component="span" variant={variant} color={color} sx={{ minWidth: 0 }}>
          {spec}
          {gearScoreText !== undefined ? ` · ${gearScoreText}` : null}
        </Typography>
      ) : gearScoreText !== undefined ? (
        <Typography component="span" variant={variant} color={color} sx={{ minWidth: 0 }}>
          {gearScoreText}
        </Typography>
      ) : null}
    </Stack>
  );

  if (showSpecName) {
    return content;
  }

  return <Tooltip title={detailLabel}>{content}</Tooltip>;
}

type CharacterSpecGearLabelProps = {
  characterClass: CharacterClass;
  spec: string;
  gearScore?: number;
  iconSize?: number;
  variant?: "body2" | "caption" | "inherit";
  color?: "text.secondary" | "inherit";
  showSpecName?: boolean;
};

export function CharacterSpecGearLabel({
  characterClass,
  spec,
  gearScore,
  iconSize,
  variant,
  color = "text.secondary",
  showSpecName = true,
}: CharacterSpecGearLabelProps) {
  return (
    <SpecOptionLabel
      className={characterClass.name}
      spec={spec}
      gearScore={gearScore}
      iconSize={iconSize}
      variant={variant}
      color={color}
      showSpecName={showSpecName}
    />
  );
}
