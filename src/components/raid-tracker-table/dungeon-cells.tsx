import { Box, Chip, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import { DungeonDifficulty, type DungeonDifficulty as DungeonDifficultyType } from "../../types/dungeons.ts";
import { getDungeonDisplayName } from "../../utils/dungeon-short-name.ts";
import { completionChipFill } from "../../utils/completion-chip-color.ts";
import {
  dungeonNameTierSx,
  getItemLevelTier,
  itemLevelTierSx,
} from "../../utils/item-level-tier.ts";
import { emblemIcons, type EmblemKey } from "../../assets/emblems/emblem-icons.ts";

type SizeChipColor = "success" | "info" | "secondary" | "warning" | "error";

function sizeChipColor(size: number): SizeChipColor {
  if (size <= 5) return "success";
  if (size <= 10) return "info";
  if (size <= 20) return "secondary";
  if (size <= 25) return "warning";
  return "error";
}

export function DungeonNameCell({
  name,
  shortName,
  compact,
  itemLevels,
  emblem,
}: {
  name: string;
  shortName?: string;
  compact: boolean;
  itemLevels: number[];
  emblem: EmblemKey | null;
}) {
  const nameTier = getItemLevelTier(itemLevels);
  const displayName = getDungeonDisplayName({ name, shortName }, compact);
  const showFullNameTooltip = compact && shortName != null && shortName !== name;

  const nameLabel = (
    <Typography
      component="span"
      variant="body2"
      className="raid-tracker-table__dungeon-name"
      sx={dungeonNameTierSx(nameTier)}
    >
      {displayName}
    </Typography>
  );

  return (
    <Stack
      direction="row"
      spacing={0.75}
      sx={{ alignItems: "center", overflow: "hidden", minWidth: 0 }}
    >
      {emblem ? (
        <Box
          component="img"
          src={emblemIcons[emblem]}
          alt=""
          sx={{ width: 18, height: 18, flexShrink: 0, borderRadius: "4px" }}
        />
      ) : null}
      {showFullNameTooltip ? (
        <Tooltip title={name}>
          <span className="raid-tracker-table__dungeon-name-wrap">{nameLabel}</span>
        </Tooltip>
      ) : (
        nameLabel
      )}
    </Stack>
  );
}

export function ItemLevelCell({ itemLevels }: { itemLevels: number[] }) {
  if (itemLevels.length === 0) {
    return (
      <Typography component="span" variant="body2" color="text.secondary">
        —
      </Typography>
    );
  }

  return (
    <>
      {itemLevels.map((itemLevel, index) => (
        <span key={`${itemLevel}-${index}`}>
          {index > 0 ? (
            <span className="raid-tracker-table__ilvl-separator"> / </span>
          ) : null}
          <Box
            component="span"
            className="raid-tracker-table__ilvl"
            sx={itemLevelTierSx(getItemLevelTier(itemLevel))}
          >
            {itemLevel}
          </Box>
        </span>
      ))}
    </>
  );
}

export function DungeonSizeCell({ size }: { size: number }) {
  const chipColor = sizeChipColor(size);

  return (
    <Chip
      size="small"
      variant="filled"
      color={chipColor}
      label={size}
      sx={{
        maxWidth: "100%",
        "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis" },
      }}
    />
  );
}

export function CompletionCountChip({
  completed,
  total,
}: {
  completed: number;
  total: number;
}) {
  const theme = useTheme();
  const fill = completionChipFill(completed, total, theme);

  return (
    <Chip
      size="small"
      variant="filled"
      label={`${completed}/${total}`}
      sx={{
        fontVariantNumeric: "tabular-nums",
        maxWidth: "100%",
        bgcolor: fill.backgroundColor,
        color: fill.color,
        "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis" },
      }}
    />
  );
}

export function DungeonDifficultyCell({
  difficulty,
}: {
  difficulty: DungeonDifficultyType;
}) {
  const isHeroic = difficulty === DungeonDifficulty.HEROIC;
  const label = isHeroic ? "H ☠️" : "N";

  return (
    <Chip
      size="small"
      variant="filled"
      color={isHeroic ? "warning" : "success"}
      label={label}
      sx={{
        maxWidth: "100%",
        ...(isHeroic
          ? {
              backgroundColor: (theme) => theme.palette.error.dark,
              color: (theme) => theme.palette.error.contrastText,
            }
          : {}),
        "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis" },
      }}
    />
  );
}

