import { Chip, Typography } from "@mui/material";
import { DungeonDifficulty, type DungeonDifficulty as DungeonDifficultyType } from "../../types/dungeons.ts";
import {
  dungeonNameTierClassName,
  getItemLevelTier,
  itemLevelTierClassName,
} from "../../utils/item-level-tier.ts";

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
  itemLevels,
}: {
  name: string;
  itemLevels: number[];
}) {
  const tierClass = dungeonNameTierClassName(getItemLevelTier(itemLevels));

  return (
    <Typography
      component="span"
      variant="body2"
      className={`raid-tracker-table__dungeon-name ${tierClass}`}
    >
      {name}
    </Typography>
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
          <span
            className={`raid-tracker-table__ilvl ${itemLevelTierClassName(getItemLevelTier(itemLevel))}`}
          >
            {itemLevel}
          </span>
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
        "& .MuiChip-icon": { opacity: 0.9 },
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

