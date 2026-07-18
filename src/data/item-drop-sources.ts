import dropSourcesJson from "./wotlk-item-drop-sources.json";
import type { RaidKey } from "./raid-names.ts";
import { DungeonDifficulty, type DungeonSize } from "../types/dungeons.ts";

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

const dropSourcesByItemId = dropSourcesJson as Record<string, BundledItemDropSourceRow[]>;

const mappedDropSourcesByItemId = new Map<number, readonly ItemDropSource[]>();

function toItemDropSource(row: BundledItemDropSourceRow): ItemDropSource {
  return {
    bossName: row.b,
    raidKey: row.k,
    size: row.s,
    difficulty: row.d === "H" ? DungeonDifficulty.HEROIC : DungeonDifficulty.NORMAL,
  };
}

/** Boss / raid drop sources for a bundled item id (empty when unknown or non-raid). */
export function getItemDropSources(itemId: number): readonly ItemDropSource[] {
  const cached = mappedDropSourcesByItemId.get(itemId);
  if (cached !== undefined) {
    return cached;
  }

  const rows = dropSourcesByItemId[String(itemId)];
  if (!rows || rows.length === 0) {
    const empty: readonly ItemDropSource[] = [];
    mappedDropSourcesByItemId.set(itemId, empty);
    return empty;
  }

  const mapped = rows.map(toItemDropSource);
  mappedDropSourcesByItemId.set(itemId, mapped);
  return mapped;
}
