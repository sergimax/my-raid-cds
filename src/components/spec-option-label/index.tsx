import { Box, Stack, Typography } from "@mui/material";
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
};

export function SpecOptionLabel({
  className,
  spec,
  gearScore,
  iconSize = 18,
  variant = "inherit",
  color = "inherit",
}: SpecOptionLabelProps) {
  const icon = specIconFor(className, spec);
  const gearScoreText =
    gearScore !== undefined ? formatCompactGearScore(gearScore) : undefined;

  return (
    <Stack
      direction="row"
      spacing={0.75}
      sx={{ alignItems: "center", minWidth: 0 }}
    >
      {icon ? (
        <Box
          component="img"
          src={icon}
          alt=""
          width={iconSize}
          height={iconSize}
          sx={{ borderRadius: "4px", flexShrink: 0 }}
        />
      ) : null}
      <Typography component="span" variant={variant} color={color} sx={{ minWidth: 0 }}>
        {spec}
        {gearScoreText !== undefined ? ` · ${gearScoreText}` : null}
      </Typography>
    </Stack>
  );
}

type CharacterSpecGearLabelProps = {
  characterClass: CharacterClass;
  spec: string;
  gearScore?: number;
  iconSize?: number;
  variant?: "body2" | "caption" | "inherit";
  color?: "text.secondary" | "inherit";
};

export function CharacterSpecGearLabel({
  characterClass,
  spec,
  gearScore,
  iconSize,
  variant,
  color = "text.secondary",
}: CharacterSpecGearLabelProps) {
  return (
    <SpecOptionLabel
      className={characterClass.name}
      spec={spec}
      gearScore={gearScore}
      iconSize={iconSize}
      variant={variant}
      color={color}
    />
  );
}
