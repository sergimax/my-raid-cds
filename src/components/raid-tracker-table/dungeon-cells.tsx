import { Chip, Typography } from "@mui/material";
import { DungeonDifficulty, type DungeonDifficulty as DungeonDifficultyType } from "../../types/dungeons.ts";
import {
  dungeonNameTierClassName,
  getItemLevelTier,
  itemLevelTierClassName,
} from "../../utils/item-level-tier.ts";

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
  return (
    <Chip
      size="small"
      variant="filled"
      color="info"
      label={size}
      sx={{
        maxWidth: "100%",
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
        "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis" },
      }}
    />
  );
}

