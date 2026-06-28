import type { AppLocale } from "../i18n/types.ts";
import type { ClassName, CharacterRecord, CharacterSpecGear } from "../types/characters.ts";
import type { DungeonRecord } from "../types/dungeons.ts";
import type { TierSetHint } from "../types/tier-sets.ts";
import type { BisSlotMap } from "./bis-lists.ts";
import {
  evaluateGearUpgradeHint,
  collectMissingBisLootItemIds,
  type GearUpgradeHint,
} from "./gear-upgrade-hint.ts";
import { evaluateTierSetHint } from "./tier-set-hint.ts";
import {
  groupBisItemIdsByBossForDungeon,
  type BossBisLootGroup,
} from "./item-drop-sources.ts";

export type SpecGearHint = {
  specGear: CharacterSpecGear;
  gearHint: GearUpgradeHint;
  tierSetHint: TierSetHint;
  /** Tier 1: exact BiS list items that drop in this raid row. */
  bisBossLootGroups: BossBisLootGroup[];
  /** Tier 2: normal (non-list) name variants of BiS items that drop here. */
  bisVariantBossLootGroups: BossBisLootGroup[];
};

export type CharacterGearHints = {
  main?: SpecGearHint;
  off?: SpecGearHint;
};

type GetBisSlotMapForSpec = (
  className: ClassName,
  spec: string,
) => BisSlotMap;

function evaluateSpecGearHint(
  specGear: CharacterSpecGear,
  className: ClassName,
  dungeon: Pick<
    DungeonRecord,
    "name" | "shortName" | "raidKey" | "itemLevel" | "size" | "difficulty"
  >,
  getBisSlotMapForSpec: GetBisSlotMapForSpec,
  locale: AppLocale,
): SpecGearHint {
  const slotMap = getBisSlotMapForSpec(className, specGear.spec);
  const bisSlotMap = slotMap.size > 0 ? slotMap : undefined;
  const equipContext = { className, spec: specGear.spec };
  const gearHint = evaluateGearUpgradeHint(
    specGear.gearItems,
    dungeon,
    bisSlotMap,
    equipContext,
  );

  const { exact: missingExactBisItemIds, variant: missingVariantBisItemIds } =
    collectMissingBisLootItemIds(gearHint);

  const bisBossLootGroups =
    missingExactBisItemIds.length > 0
      ? groupBisItemIdsByBossForDungeon(missingExactBisItemIds, dungeon, locale)
      : [];

  const bisVariantBossLootGroups =
    missingVariantBisItemIds.length > 0
      ? groupBisItemIdsByBossForDungeon(missingVariantBisItemIds, dungeon, locale)
      : [];

  return {
    specGear,
    gearHint,
    tierSetHint: evaluateTierSetHint(specGear.gearItems, dungeon, bisSlotMap),
    bisBossLootGroups,
    bisVariantBossLootGroups,
  };
}

export function evaluateCharacterGearHints(
  character: CharacterRecord,
  dungeon: Pick<
    DungeonRecord,
    "name" | "shortName" | "raidKey" | "itemLevel" | "size" | "difficulty"
  >,
  getBisSlotMapForSpec: GetBisSlotMapForSpec,
  locale: AppLocale,
): CharacterGearHints {
  const className = character.class?.name;
  if (!className) {
    return {};
  }

  const hints: CharacterGearHints = {};

  if (character.mainSpec) {
    hints.main = evaluateSpecGearHint(
      character.mainSpec,
      className,
      dungeon,
      getBisSlotMapForSpec,
      locale,
    );
  }

  if (character.offSpec) {
    hints.off = evaluateSpecGearHint(
      character.offSpec,
      className,
      dungeon,
      getBisSlotMapForSpec,
      locale,
    );
  }

  return hints;
}

export function hasAnyGearHint(hints: CharacterGearHints): boolean {
  const mainActive =
    hints.main &&
    (hints.main.gearHint.bis.level > 0 ||
      hints.main.gearHint.bisVariant.level > 0 ||
      hints.main.gearHint.ilvl.level > 0 ||
      hints.main.tierSetHint.tokenNeeds.length > 0 ||
      hints.main.bisBossLootGroups.length > 0 ||
      hints.main.bisVariantBossLootGroups.length > 0);
  const offActive =
    hints.off &&
    (hints.off.gearHint.bis.level > 0 ||
      hints.off.gearHint.bisVariant.level > 0 ||
      hints.off.gearHint.ilvl.level > 0 ||
      hints.off.tierSetHint.tokenNeeds.length > 0 ||
      hints.off.bisBossLootGroups.length > 0 ||
      hints.off.bisVariantBossLootGroups.length > 0);
  return Boolean(mainActive || offActive);
}
