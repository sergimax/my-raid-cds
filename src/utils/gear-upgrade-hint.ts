import type { TranslateFn } from "../i18n/translate.ts";
import {
  expandItemIdsWithNameVariantsAtSlot,
  getNonListNameVariantItemIdsAtSlot,
  isItemIdOrNameVariantAtSlot,
} from "../data/bis-item-variants.ts";
import { getRaidLootItemIdsForTier } from "../data/raid-loot.ts";
import { getWotlkItemLevel } from "../data/wotlk-item-levels.ts";
import type { CharacterGearItem } from "../types/character-gear.ts";
import type { DungeonRecord } from "../types/dungeons.ts";
import type { BisSlotMap } from "./bis-lists.ts";
import {
  type CharacterEquipContext,
  filterUsableLootItemIds,
} from "./item-equip-restrictions.ts";
import { filterRaidLootItemIdsForDungeon } from "./item-drop-sources.ts";
import { resolveDungeonRaidKey } from "./resolve-dungeon-raid-key.ts";

export type GearUpgradeHintLevel = 0 | 1 | 2 | 3;

export type GearUpgradeSlotHint = {
  slot: number;
  bestLootItemId?: number;
  bestLootItemLevel?: number;
};

export type GearUpgradeHintTrack = {
  level: GearUpgradeHintLevel;
  upgradeSlotCount: number;
  upgradeSlots: GearUpgradeSlotHint[];
};

export type GearUpgradeHint = {
  /** Exact BiS-list item ids missing as upgrades in this dungeon (tier 1). */
  bis: GearUpgradeHintTrack;
  /** Normal name variants of BiS items missing as upgrades (tier 2). */
  bisVariant: GearUpgradeHintTrack;
  /** Spec-relevant ilvl raid loot excluding BiS targets (tier 3). */
  ilvl: GearUpgradeHintTrack;
  equippedCount: number;
  peakDungeonItemLevel: number;
  slotAware: boolean;
  bisListActive: boolean;
};

export type GearHintCellDisplay = {
  kind: "bis" | "ilvl";
  level: GearUpgradeHintLevel;
};

const EMPTY_HINT_TRACK: GearUpgradeHintTrack = {
  level: 0,
  upgradeSlotCount: 0,
  upgradeSlots: [],
};

/** Peak ilvl offered by a dungeon row (highest tier drop). */
export function getDungeonPeakItemLevel(itemLevels: readonly number[]): number {
  if (itemLevels.length === 0) {
    return 0;
  }
  return Math.max(...itemLevels);
}

function upgradeHintLevelFromRatio(ratio: number): GearUpgradeHintLevel {
  if (ratio <= 0) {
    return 0;
  }
  if (ratio <= 0.25) {
    return 1;
  }
  if (ratio <= 0.5) {
    return 2;
  }
  return 3;
}

function isSlotUpgradeableNaive(
  itemLevel: number | undefined,
  peakDungeonItemLevel: number,
): boolean {
  return itemLevel === undefined || itemLevel < peakDungeonItemLevel;
}

type PickBestLootOptions = {
  filterBySpecStats?: boolean;
  /** Prefer these ids when item levels tie (e.g. BiS normal/heroic name variants). */
  preferredItemIds?: readonly number[];
};

function pickBestLootItemId(
  itemIds: readonly number[],
  gearSlot: number,
  equipContext: CharacterEquipContext,
  options?: PickBestLootOptions,
): number | undefined {
  const usableItemIds = filterUsableLootItemIds(itemIds, gearSlot, equipContext, options);
  const preferredItemIds = options?.preferredItemIds;
  let bestItemId: number | undefined;
  let bestItemLevel = -1;

  for (const itemId of usableItemIds) {
    const itemLevel = getWotlkItemLevel(itemId);
    if (itemLevel === undefined) {
      continue;
    }

    const isPreferred = preferredItemIds?.includes(itemId) ?? false;
    const bestIsPreferred =
      bestItemId !== undefined && (preferredItemIds?.includes(bestItemId) ?? false);

    if (
      itemLevel > bestItemLevel ||
      (itemLevel === bestItemLevel && isPreferred && !bestIsPreferred)
    ) {
      bestItemLevel = itemLevel;
      bestItemId = itemId;
    }
  }

  return bestItemId;
}

function pickBestLootItemLevel(
  itemIds: readonly number[],
  gearSlot: number,
  equipContext: CharacterEquipContext,
): number | undefined {
  const usableItemIds = filterUsableLootItemIds(itemIds, gearSlot, equipContext);
  const itemLevels = usableItemIds
    .map((itemId) => getWotlkItemLevel(itemId))
    .filter((itemLevel): itemLevel is number => itemLevel !== undefined);

  if (itemLevels.length === 0) {
    return undefined;
  }

  return Math.max(...itemLevels);
}

type GearUpgradeDungeon = Pick<
  DungeonRecord,
  "name" | "shortName" | "raidKey" | "itemLevel"
> &
  Partial<Pick<DungeonRecord, "size" | "difficulty">>;

function getRaidLootItemIdsForDungeonRow(
  raidKey: NonNullable<ReturnType<typeof resolveDungeonRaidKey>>,
  gearSlot: number,
  dungeon: GearUpgradeDungeon,
): number[] {
  const tierItemIds = getRaidLootItemIdsForTier(
    raidKey,
    gearSlot,
    dungeon.itemLevel,
  );
  if (dungeon.size === undefined || dungeon.difficulty === undefined) {
    return tierItemIds;
  }
  return filterRaidLootItemIdsForDungeon(tierItemIds, dungeon);
}

type LootFilterMode = "exact-bis" | "variant-bis" | "ilvl";

function isSlotUpgradeableWithLoot(
  item: CharacterGearItem,
  dungeon: GearUpgradeDungeon,
  equipContext: CharacterEquipContext,
  mode: LootFilterMode,
  bisItemIdsForSlot?: readonly number[],
): GearUpgradeSlotHint | null {
  const raidKey = resolveDungeonRaidKey(dungeon);
  if (!raidKey) {
    return null;
  }

  const dungeonItemLevels = dungeon.itemLevel;
  if (mode !== "ilvl" && (!bisItemIdsForSlot || bisItemIdsForSlot.length === 0)) {
    return null;
  }

  const expandedBisItemIds =
    bisItemIdsForSlot !== undefined
      ? expandItemIdsWithNameVariantsAtSlot(bisItemIdsForSlot, item.slot)
      : [];
  const variantOnlyBisItemIds =
    bisItemIdsForSlot !== undefined
      ? getNonListNameVariantItemIdsAtSlot(bisItemIdsForSlot, item.slot)
      : [];

  const raidLootIds = filterUsableLootItemIds(
    getRaidLootItemIdsForDungeonRow(raidKey, item.slot, dungeon),
    item.slot,
    equipContext,
    { filterBySpecStats: mode === "ilvl" },
  );

  let relevantLootIds: number[];
  switch (mode) {
    case "exact-bis":
      relevantLootIds = raidLootIds.filter((itemId) =>
        bisItemIdsForSlot!.includes(itemId),
      );
      break;
    case "variant-bis":
      relevantLootIds = raidLootIds.filter((itemId) =>
        variantOnlyBisItemIds.includes(itemId),
      );
      break;
    case "ilvl":
      relevantLootIds = raidLootIds.filter(
        (itemId) => !expandedBisItemIds.includes(itemId),
      );
      break;
  }

  if (relevantLootIds.length === 0) {
    return null;
  }

  const pickOptions: PickBestLootOptions = {
    filterBySpecStats: mode === "ilvl",
    preferredItemIds: mode === "ilvl" ? undefined : relevantLootIds,
  };

  const bestLootItemLevel = pickBestLootItemLevel(
    relevantLootIds,
    item.slot,
    equipContext,
  );
  if (bestLootItemLevel === undefined) {
    return null;
  }

  if (mode === "exact-bis") {
    if (bisItemIdsForSlot!.includes(item.id)) {
      return null;
    }

    return {
      slot: item.slot,
      bestLootItemId: pickBestLootItemId(
        relevantLootIds,
        item.slot,
        equipContext,
        pickOptions,
      ),
      bestLootItemLevel,
    };
  }

  if (mode === "variant-bis") {
    if (isItemIdOrNameVariantAtSlot(item.id, bisItemIdsForSlot!, item.slot)) {
      return null;
    }

    return {
      slot: item.slot,
      bestLootItemId: pickBestLootItemId(
        relevantLootIds,
        item.slot,
        equipContext,
        pickOptions,
      ),
      bestLootItemLevel,
    };
  }

  const itemLevel = getWotlkItemLevel(item.id);
  if (itemLevel !== undefined && itemLevel >= bestLootItemLevel) {
    return null;
  }

  return {
    slot: item.slot,
    bestLootItemId: pickBestLootItemId(
      relevantLootIds,
      item.slot,
      equipContext,
      pickOptions,
    ),
    bestLootItemLevel,
  };
}

function buildHintTrack(
  upgradeSlots: GearUpgradeSlotHint[],
  equippedCount: number,
): GearUpgradeHintTrack {
  const level =
    equippedCount === 0
      ? 0
      : upgradeHintLevelFromRatio(upgradeSlots.length / equippedCount);

  return {
    level,
    upgradeSlotCount: upgradeSlots.length,
    upgradeSlots,
  };
}

function evaluateNaiveIlvlTrack(
  gearItems: readonly CharacterGearItem[],
  peakDungeonItemLevel: number,
): GearUpgradeHintTrack {
  const upgradeSlots: GearUpgradeSlotHint[] = [];

  for (const item of gearItems) {
    const itemLevel = getWotlkItemLevel(item.id);
    if (isSlotUpgradeableNaive(itemLevel, peakDungeonItemLevel)) {
      upgradeSlots.push({ slot: item.slot, bestLootItemLevel: peakDungeonItemLevel });
    }
  }

  return buildHintTrack(upgradeSlots, gearItems.length);
}

function evaluateBisTrack(
  gearItems: readonly CharacterGearItem[],
  dungeon: GearUpgradeDungeon,
  equipContext: CharacterEquipContext,
  bisSlotMap: BisSlotMap,
  mode: "exact-bis" | "variant-bis",
): GearUpgradeHintTrack {
  const upgradeSlots: GearUpgradeSlotHint[] = [];

  for (const item of gearItems) {
    const bisItemIdsForSlot = bisSlotMap.get(item.slot);
    if (!bisItemIdsForSlot || bisItemIdsForSlot.length === 0) {
      continue;
    }

    const slotHint = isSlotUpgradeableWithLoot(
      item,
      dungeon,
      equipContext,
      mode,
      bisItemIdsForSlot,
    );
    if (slotHint) {
      upgradeSlots.push(slotHint);
    }
  }

  return buildHintTrack(upgradeSlots, gearItems.length);
}

function evaluateIlvlRaidLootTrack(
  gearItems: readonly CharacterGearItem[],
  dungeon: GearUpgradeDungeon,
  equipContext: CharacterEquipContext,
  bisSlotMap?: BisSlotMap,
): GearUpgradeHintTrack {
  const upgradeSlots: GearUpgradeSlotHint[] = [];

  for (const item of gearItems) {
    const bisItemIdsForSlot = bisSlotMap?.get(item.slot);

    const slotHint = isSlotUpgradeableWithLoot(
      item,
      dungeon,
      equipContext,
      "ilvl",
      bisItemIdsForSlot,
    );
    if (slotHint) {
      upgradeSlots.push(slotHint);
    }
  }

  return buildHintTrack(upgradeSlots, gearItems.length);
}

function emptyGearUpgradeHint(
  equippedCount: number,
  peakDungeonItemLevel: number,
  slotAware: boolean,
  bisListActive: boolean,
): GearUpgradeHint {
  return {
    bis: EMPTY_HINT_TRACK,
    bisVariant: EMPTY_HINT_TRACK,
    ilvl: EMPTY_HINT_TRACK,
    equippedCount,
    peakDungeonItemLevel,
    slotAware,
    bisListActive,
  };
}

export function evaluateGearUpgradeHint(
  gearItems: readonly CharacterGearItem[] | undefined,
  dungeon: GearUpgradeDungeon,
  bisSlotMap?: BisSlotMap,
  equipContext: CharacterEquipContext = {},
): GearUpgradeHint {
  const dungeonItemLevels = dungeon.itemLevel;
  const peakDungeonItemLevel = getDungeonPeakItemLevel(dungeonItemLevels);
  const equippedCount = gearItems?.length ?? 0;
  const bisListActive = bisSlotMap !== undefined && bisSlotMap.size > 0;

  if (equippedCount === 0 || peakDungeonItemLevel === 0 || !gearItems) {
    return emptyGearUpgradeHint(
      equippedCount,
      peakDungeonItemLevel,
      false,
      bisListActive,
    );
  }

  const raidKey = resolveDungeonRaidKey(dungeon);
  if (raidKey) {
    const bis =
      bisListActive && bisSlotMap
        ? evaluateBisTrack(
            gearItems,
            dungeon,
            equipContext,
            bisSlotMap,
            "exact-bis",
          )
        : EMPTY_HINT_TRACK;

    const bisVariant =
      bisListActive && bisSlotMap
        ? evaluateBisTrack(
            gearItems,
            dungeon,
            equipContext,
            bisSlotMap,
            "variant-bis",
          )
        : EMPTY_HINT_TRACK;

    const ilvl = evaluateIlvlRaidLootTrack(
      gearItems,
      dungeon,
      equipContext,
      bisListActive ? bisSlotMap : undefined,
    );

    return {
      bis,
      bisVariant,
      ilvl,
      equippedCount,
      peakDungeonItemLevel,
      slotAware: true,
      bisListActive,
    };
  }

  return {
    bis: EMPTY_HINT_TRACK,
    bisVariant: EMPTY_HINT_TRACK,
    ilvl: evaluateNaiveIlvlTrack(gearItems, peakDungeonItemLevel),
    equippedCount,
    peakDungeonItemLevel,
    slotAware: false,
    bisListActive,
  };
}

/** Cell tint kind: BiS targets (exact or normal variant) take priority over ilvl upgrades. */
export function getGearHintCellDisplay(
  hint: GearUpgradeHint,
): GearHintCellDisplay | null {
  const bisLevel = Math.max(hint.bis.level, hint.bisVariant.level) as GearUpgradeHintLevel;

  if (hint.bisListActive && bisLevel > 0) {
    return { kind: "bis", level: bisLevel };
  }
  if (hint.ilvl.level > 0) {
    return { kind: "ilvl", level: hint.ilvl.level };
  }
  return null;
}

export type GearUpgradeHintTooltipOptions = {
  /** Boss-grouped non-BiS ilvl list is shown — omit redundant count line. */
  showIlvlBossLoot?: boolean;
};

function collectMissingLootItemIds(track: GearUpgradeHintTrack): number[] {
  const itemIds: number[] = [];

  for (const slotHint of track.upgradeSlots) {
    if (
      slotHint.bestLootItemId !== undefined &&
      !itemIds.includes(slotHint.bestLootItemId)
    ) {
      itemIds.push(slotHint.bestLootItemId);
    }
  }

  return itemIds;
}

/** Item ids for boss-grouped BiS loot sections (missing upgrades only). */
export function collectMissingBisLootItemIds(hint: GearUpgradeHint): {
  exact: number[];
  variant: number[];
} {
  return {
    exact: collectMissingLootItemIds(hint.bis),
    variant: collectMissingLootItemIds(hint.bisVariant),
  };
}

/** Item ids for boss-grouped non-BiS ilvl upgrade sections (missing upgrades only). */
export function collectMissingIlvlLootItemIds(hint: GearUpgradeHint): number[] {
  return collectMissingLootItemIds(hint.ilvl);
}

export function formatGearUpgradeHintTooltip(
  hint: GearUpgradeHint,
  t: TranslateFn,
  options?: GearUpgradeHintTooltipOptions,
): string {
  if (hint.ilvl.level > 0 && !options?.showIlvlBossLoot) {
    const introKey = hint.slotAware
      ? "gearHint.raidLootUpgrades"
      : "gearHint.belowIlvl";
    return introKey === "gearHint.belowIlvl"
      ? t(introKey, {
          count: hint.ilvl.upgradeSlotCount,
          total: hint.equippedCount,
          ilvl: hint.peakDungeonItemLevel,
        })
      : t(introKey, { count: hint.ilvl.upgradeSlotCount });
  }

  return "";
}
