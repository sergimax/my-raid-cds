import dropSourcesJson from "./wotlk-item-drop-sources.json";
import type { RaidKey } from "./raid-names.ts";
import { DungeonDifficulty, type DungeonSize } from "../types/dungeons.ts";
import { buildItemIdMap } from "./build-item-id-map.ts";

/** Compact drop source row from bundled WowSims data (`wotlk-item-drop-sources.json`). */
export type BundledItemDropSourceRow = {
  /** Boss or encounter name. */
  b: string;
  /** Template raid key. */
  k: RaidKey;
  /** Raid size (10 / 25). */
  s: DungeonSize;
  /** `N` = Normal, `H` = Heroic. */
  d: "N" | "H";
};

export type ItemDropSource = {
  bossName: string;
  raidKey: RaidKey;
  size: DungeonSize;
  difficulty: (typeof DungeonDifficulty)[keyof typeof DungeonDifficulty];
};

function toItemDropSource(row: BundledItemDropSourceRow): ItemDropSource {
  return {
    bossName: row.b,
    raidKey: row.k,
    size: row.s,
    difficulty: row.d === "H" ? DungeonDifficulty.HEROIC : DungeonDifficulty.NORMAL,
  };
}

const bundledRowsByItemId = buildItemIdMap(
  dropSourcesJson as Record<string, BundledItemDropSourceRow[]>,
);

/** Eagerly mapped drop sources (empty array when the item has no raid drops). */
const dropSourcesByItemId = new Map<number, readonly ItemDropSource[]>();
for (const [itemId, rows] of bundledRowsByItemId) {
  dropSourcesByItemId.set(
    itemId,
    rows.length > 0 ? rows.map(toItemDropSource) : [],
  );
}

const EMPTY_DROP_SOURCES: readonly ItemDropSource[] = [];

/** Boss / raid drop sources for a bundled item id (empty when unknown or non-raid). */
export function getItemDropSources(itemId: number): readonly ItemDropSource[] {
  return dropSourcesByItemId.get(itemId) ?? EMPTY_DROP_SOURCES;
}
