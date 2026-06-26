import { getWotlkItemLevel } from "../data/wotlk-item-levels.ts";
import type { CharacterGearItem } from "../types/character-gear.ts";

export type GearItemLevelSummary = {
  equippedCount: number;
  knownItemLevels: number[];
  unknownItemIds: number[];
  averageItemLevel?: number;
};

export function summarizeGearItemLevels(
  gearItems: readonly CharacterGearItem[],
): GearItemLevelSummary {
  const knownItemLevels: number[] = [];
  const unknownItemIds: number[] = [];

  for (const item of gearItems) {
    const itemLevel = getWotlkItemLevel(item.id);
    if (itemLevel === undefined) {
      unknownItemIds.push(item.id);
    } else {
      knownItemLevels.push(itemLevel);
    }
  }

  const averageItemLevel =
    knownItemLevels.length > 0
      ? Math.round(
          knownItemLevels.reduce((sum, level) => sum + level, 0) /
            knownItemLevels.length,
        )
      : undefined;

  return {
    equippedCount: gearItems.length,
    knownItemLevels,
    unknownItemIds,
    averageItemLevel,
  };
}
