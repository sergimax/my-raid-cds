import { Box, Chip, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import { useTranslation } from "../../i18n/use-translation.ts";
import { getLocalizedDungeonDisplayName } from "../../i18n/localized-domain.ts";
import {
  DungeonDifficulty,
  type Dungeon,
  type DungeonDifficulty as DungeonDifficultyType,
} from "../../types/dungeons.ts";
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
  raidKey,
  compact,
  itemLevels,
  emblem,
}: {
  name: string;
  shortName?: string;
  raidKey?: Dungeon["raidKey"];
  compact: boolean;
  itemLevels: number[];
  emblem: EmblemKey | null;
}) {
  const { locale } = useTranslation();
  const dungeon = { name, shortName, raidKey };
  const nameTier = getItemLevelTier(itemLevels);
  const displayName = getLocalizedDungeonDisplayName(dungeon, locale, compact);
  const fullName = getLocalizedDungeonDisplayName(dungeon, locale, false);
  const showFullNameTooltip = compact && displayName !== fullName;

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
        <Tooltip title={fullName}>
          <span className="raid-tracker-table__dungeon-name-wrap">{nameLabel}</span>
        </Tooltip>
      ) : (
        nameLabel
      )}
    </Stack>
  );
}

export function ItemLevelCell({ itemLevels }: { itemLevels: number[] }) {
  const { t } = useTranslation();

  if (itemLevels.length === 0) {
    return (
      <Typography component="span" variant="body2" color="text.secondary">
        {t("table.emptyIlvl")}
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
  const { t } = useTranslation();
  const isHeroic = difficulty === DungeonDifficulty.HEROIC;
  const label = isHeroic ? t("table.difficultyHeroic") : t("table.difficultyNormal");

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
