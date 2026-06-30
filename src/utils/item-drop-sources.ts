import type { ItemDropSource } from "../data/item-drop-sources.ts";
import { getItemDropSources } from "../data/item-drop-sources.ts";
import { DungeonList } from "../data/dungeon-list.ts";
import { RaidNames, type RaidKey } from "../data/raid-names.ts";
import type { AppLocale } from "../i18n/types.ts";
import {
  getLocalizedBossName,
  getLocalizedDungeonDisplayName,
} from "../i18n/localized-domain.ts";
import { DungeonDifficulty, type DungeonSize } from "../types/dungeons.ts";
import type { DungeonRecord } from "../types/dungeons.ts";
import { formatDungeonExportLabel } from "./format-dungeon-label.ts";
import { resolveDungeonRaidKey } from "./resolve-dungeon-raid-key.ts";

export type FormattedItemDropSource = {
  bossName: string;
  raidLabel: string;
  source: ItemDropSource;
};

type DungeonSourceMatch = Pick<
  DungeonRecord,
  "name" | "shortName" | "raidKey" | "size" | "difficulty"
>;

function dungeonTemplateHasHeroic(raidKey: RaidKey, size: DungeonSize): boolean {
  return DungeonList.some(
    (row) =>
      row.raidKey === raidKey &&
      row.size === size &&
      row.difficulty === DungeonDifficulty.HEROIC,
  );
}

function dungeonMatchesDropSource(
  dungeon: DungeonSourceMatch,
  source: ItemDropSource,
): boolean {
  const raidKey = resolveDungeonRaidKey(dungeon);
  if (!raidKey || raidKey !== source.raidKey) {
    return false;
  }
  if (dungeon.size !== source.size) {
    return false;
  }
  if (dungeon.difficulty !== source.difficulty) {
    // Onyxia, VoA, Naxx, etc. only have Normal loot — still show items when the row
    // is marked Heroic or drop metadata is tagged Normal only.
    if (
      source.difficulty === DungeonDifficulty.NORMAL &&
      !dungeonTemplateHasHeroic(raidKey, dungeon.size)
    ) {
      return true;
    }
    return false;
  }
  return true;
}

function formatRaidLabelForSource(
  source: ItemDropSource,
  locale: AppLocale,
): string {
  const raid = RaidNames[source.raidKey];
  const shortName =
    locale === "ru"
      ? raid.shortRu
      : "shortEn" in raid
        ? raid.shortEn
        : undefined;

  return formatDungeonExportLabel(
    {
      name: locale === "ru" ? raid.ru : raid.en,
      shortName,
      raidKey: source.raidKey,
      size: source.size,
      difficulty: source.difficulty,
    },
    locale,
  );
}

export function formatItemDropSource(
  source: ItemDropSource,
  locale: AppLocale,
): FormattedItemDropSource {
  return {
    bossName: getLocalizedBossName(source.bossName, locale),
    raidLabel: formatRaidLabelForSource(source, locale),
    source,
  };
}

export function formatItemDropSourceLine(
  source: ItemDropSource,
  locale: AppLocale,
): string {
  const formatted = formatItemDropSource(source, locale);
  return `${formatted.raidLabel} · ${formatted.bossName}`;
}

/** Unique formatted drop sources for an item (deduped by raid label + boss). */
export function getFormattedItemDropSources(
  itemId: number,
  locale: AppLocale,
): FormattedItemDropSource[] {
  const seen = new Set<string>();
  const formatted: FormattedItemDropSource[] = [];

  for (const source of getItemDropSources(itemId)) {
    const entry = formatItemDropSource(source, locale);
    const key = `${entry.raidLabel}|${entry.bossName}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    formatted.push(entry);
  }

  return formatted;
}

export type BossBisLootGroup = {
  bossName: string;
  itemIds: number[];
};

function bossGroupKey(bossName: string): string {
  return bossName.toLocaleLowerCase();
}

/** BiS item ids from this dungeon row, grouped by boss drop source. */
export function groupBisItemIdsByBossForDungeon(
  itemIds: readonly number[],
  dungeon: DungeonSourceMatch,
  locale: AppLocale,
): BossBisLootGroup[] {
  const raidKey = resolveDungeonRaidKey(dungeon);
  if (!raidKey) {
    return [];
  }

  const groups = new Map<string, BossBisLootGroup>();

  for (const itemId of itemIds) {
    const matchingSources = getItemDropSources(itemId).filter((source) =>
      dungeonMatchesDropSource(dungeon, source),
    );
    if (matchingSources.length === 0) {
      continue;
    }

    for (const source of matchingSources) {
      const formatted = formatItemDropSource(source, locale);
      const key = bossGroupKey(source.bossName);
      const existing = groups.get(key);
      if (existing) {
        if (!existing.itemIds.includes(itemId)) {
          existing.itemIds.push(itemId);
        }
      } else {
        groups.set(key, { bossName: formatted.bossName, itemIds: [itemId] });
      }
    }
  }

  return [...groups.values()]
    .map((group) => ({
      ...group,
      itemIds: [...group.itemIds].sort((leftId, rightId) => leftId - rightId),
    }))
    .sort((leftGroup, rightGroup) =>
      leftGroup.bossName.localeCompare(rightGroup.bossName, locale),
    );
}

function sortUniqueItemIds(itemIds: readonly number[]): number[] {
  return [...new Set(itemIds)].sort((leftId, rightId) => leftId - rightId);
}

/** Like {@link groupBisItemIdsByBossForDungeon} but lists items flat when boss metadata is missing. */
export function groupBisItemIdsByBossForDungeonWithFallback(
  itemIds: readonly number[],
  dungeon: DungeonSourceMatch,
  locale: AppLocale,
): BossBisLootGroup[] {
  const grouped = groupBisItemIdsByBossForDungeon(itemIds, dungeon, locale);
  if (grouped.length > 0 || itemIds.length === 0) {
    return grouped;
  }

  return [{ bossName: "", itemIds: sortUniqueItemIds(itemIds) }];
}

/** Short raid label for a dungeon row (export-style abbreviation + size + mode). */
export function formatDungeonRaidAbbreviation(
  dungeon: DungeonSourceMatch,
  locale: AppLocale,
): string {
  const raidKey = resolveDungeonRaidKey(dungeon);
  if (!raidKey) {
    return getLocalizedDungeonDisplayName(dungeon, locale, true);
  }
  return formatDungeonExportLabel(dungeon, locale);
}
