import type { AppLocale } from "../i18n/types.ts";
import type { CharacterRecord } from "../types/characters.ts";
import type { DungeonRecord } from "../types/dungeons.ts";
import { evaluateSpecGearHint } from "./character-gear-hints.ts";
import { formatDungeonExportLabel } from "./format-dungeon-label.ts";
import type { GetBisSlotMapForSpec } from "./bis-lists.ts";

export type GearPickItemKind = "bis" | "variant";

export type GearPickSpecSide = "main" | "off";

export type GearPickItem = {
  itemId: number;
  kind: GearPickItemKind;
  bossName: string;
  raidLabel: string;
};

type BuildGearPickItemsOptions = {
  character: CharacterRecord;
  specSide: GearPickSpecSide;
  dungeons: readonly DungeonRecord[];
  getBisSlotMapForSpec: GetBisSlotMapForSpec;
  locale: AppLocale;
};

function mergeGearPickItem(
  byItemId: Map<number, GearPickItem>,
  itemId: number,
  kind: GearPickItemKind,
  bossName: string,
  raidLabel: string,
): void {
  const existing = byItemId.get(itemId);
  if (!existing) {
    byItemId.set(itemId, { itemId, kind, bossName, raidLabel });
    return;
  }

  // Prefer exact BiS over variant when the same id appears in both tracks.
  if (existing.kind === "variant" && kind === "bis") {
    existing.kind = "bis";
  }
  if (!existing.bossName && bossName) {
    existing.bossName = bossName;
  }
  if (!existing.raidLabel && raidLabel) {
    existing.raidLabel = raidLabel;
  }
}

/**
 * Collects missing BiS exact + variant upgrade items for one character/spec
 * across filtered dungeon rows (deduped by item id).
 */
export function buildGearPickItems({
  character,
  specSide,
  dungeons,
  getBisSlotMapForSpec,
  locale,
}: BuildGearPickItemsOptions): GearPickItem[] {
  const className = character.class?.name;
  if (!className) {
    return [];
  }

  const specGear =
    specSide === "main" ? character.mainSpec : character.offSpec;
  if (!specGear) {
    return [];
  }

  const byItemId = new Map<number, GearPickItem>();

  for (const dungeon of dungeons) {
    const specHint = evaluateSpecGearHint(
      specGear,
      className,
      dungeon,
      getBisSlotMapForSpec,
      locale,
    );

    const raidLabel = formatDungeonExportLabel(dungeon, locale);

    for (const group of specHint.bisBossLootGroups) {
      for (const itemId of group.itemIds) {
        mergeGearPickItem(byItemId, itemId, "bis", group.bossName, raidLabel);
      }
    }

    for (const group of specHint.bisVariantBossLootGroups) {
      for (const itemId of group.itemIds) {
        mergeGearPickItem(
          byItemId,
          itemId,
          "variant",
          group.bossName,
          raidLabel,
        );
      }
    }
  }

  return [...byItemId.values()].sort((left, right) => {
    const raidCompare = left.raidLabel.localeCompare(right.raidLabel, locale);
    if (raidCompare !== 0) {
      return raidCompare;
    }
    const bossCompare = left.bossName.localeCompare(right.bossName, locale);
    if (bossCompare !== 0) {
      return bossCompare;
    }
    return left.itemId - right.itemId;
  });
}
