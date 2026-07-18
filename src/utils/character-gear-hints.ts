import type { AppLocale } from "../i18n/types.ts";
import type { ClassName, CharacterRecord, CharacterSpecGear } from "../types/characters.ts";
import type { DungeonRecord } from "../types/dungeons.ts";
import type { TierSetHint } from "../types/tier-sets.ts";
import type { BisSlotMap } from "./bis-lists.ts";
import {
  evaluateGearUpgradeHint,
  collectMissingBisLootItemIds,
  collectMissingIlvlLootItemIds,
  type GearUpgradeHint,
} from "./gear-upgrade-hint.ts";
import { evaluateTierSetHint } from "./tier-set-hint.ts";
import {
  groupBisItemIdsByBossForDungeonWithFallback,
  type BossBisLootGroup,
} from "./item-drop-sources.ts";

export type SpecGearHintCore = {
  specGear: CharacterSpecGear;
  gearHint: GearUpgradeHint;
  /** Evaluated with tint (needed for tooltip eligibility when only tokens apply). */
  tierSetHint: TierSetHint;
};

export type SpecGearHint = SpecGearHintCore & {
  /** Tier 1: exact BiS list items that drop in this raid row. */
  bisBossLootGroups: BossBisLootGroup[];
  /** Tier 2: normal (non-list) name variants of BiS items that drop here. */
  bisVariantBossLootGroups: BossBisLootGroup[];
  /** Tier 3: spec-relevant raid loot upgrades excluding BiS targets. */
  ilvlBossLootGroups: BossBisLootGroup[];
};

export type CharacterGearHintTints = {
  main?: SpecGearHintCore;
  off?: SpecGearHintCore;
};

export type CharacterGearHints = {
  main?: SpecGearHint;
  off?: SpecGearHint;
};

type GetBisSlotMapForSpec = (
  className: ClassName,
  spec: string,
) => BisSlotMap;

type GearHintDungeon = Pick<
  DungeonRecord,
  "name" | "shortName" | "raidKey" | "itemLevel" | "size" | "difficulty"
>;

/** Tint-level evaluation: gear hint tracks + tier tokens (no boss grouping). */
export function evaluateSpecGearHintCore(
  specGear: CharacterSpecGear,
  className: ClassName,
  dungeon: GearHintDungeon,
  getBisSlotMapForSpec: GetBisSlotMapForSpec,
): SpecGearHintCore {
  const slotMap = getBisSlotMapForSpec(className, specGear.spec);
  const bisSlotMap = slotMap.size > 0 ? slotMap : undefined;
  const equipContext = { className, spec: specGear.spec };
  const gearHint = evaluateGearUpgradeHint(
    specGear.gearItems,
    dungeon,
    bisSlotMap,
    equipContext,
  );

  return {
    specGear,
    gearHint,
    tierSetHint: evaluateTierSetHint(
      specGear.gearItems,
      dungeon,
      bisSlotMap,
      className,
    ),
  };
}

/** Attach boss-grouped loot lists for tooltip / Soft pick display. */
export function withBossLootGroups(
  core: SpecGearHintCore,
  dungeon: GearHintDungeon,
  locale: AppLocale,
): SpecGearHint {
  const { exact: missingExactBisItemIds, variant: missingVariantBisItemIds } =
    collectMissingBisLootItemIds(core.gearHint);

  const bisBossLootGroups =
    missingExactBisItemIds.length > 0
      ? groupBisItemIdsByBossForDungeonWithFallback(
          missingExactBisItemIds,
          dungeon,
          locale,
        )
      : [];

  const bisVariantBossLootGroups =
    missingVariantBisItemIds.length > 0
      ? groupBisItemIdsByBossForDungeonWithFallback(
          missingVariantBisItemIds,
          dungeon,
          locale,
        )
      : [];

  const missingIlvlLootItemIds = collectMissingIlvlLootItemIds(core.gearHint);
  const ilvlBossLootGroups =
    missingIlvlLootItemIds.length > 0
      ? groupBisItemIdsByBossForDungeonWithFallback(
          missingIlvlLootItemIds,
          dungeon,
          locale,
        )
      : [];

  return {
    ...core,
    bisBossLootGroups,
    bisVariantBossLootGroups,
    ilvlBossLootGroups,
  };
}

/** Full single-spec evaluation (tint + boss groups). */
export function evaluateSpecGearHint(
  specGear: CharacterSpecGear,
  className: ClassName,
  dungeon: GearHintDungeon,
  getBisSlotMapForSpec: GetBisSlotMapForSpec,
  locale: AppLocale,
): SpecGearHint {
  return withBossLootGroups(
    evaluateSpecGearHintCore(specGear, className, dungeon, getBisSlotMapForSpec),
    dungeon,
    locale,
  );
}

/** Per-cell tint path: both specs, no boss grouping. */
export function evaluateCharacterGearHintTints(
  character: CharacterRecord,
  dungeon: GearHintDungeon,
  getBisSlotMapForSpec: GetBisSlotMapForSpec,
): CharacterGearHintTints {
  const className = character.class?.name;
  if (!className) {
    return {};
  }

  const tints: CharacterGearHintTints = {};

  if (character.mainSpec) {
    tints.main = evaluateSpecGearHintCore(
      character.mainSpec,
      className,
      dungeon,
      getBisSlotMapForSpec,
    );
  }

  if (character.offSpec) {
    tints.off = evaluateSpecGearHintCore(
      character.offSpec,
      className,
      dungeon,
      getBisSlotMapForSpec,
    );
  }

  return tints;
}

/** Enrich tint cores with boss loot for tooltip content. */
export function evaluateCharacterGearHintsFromTints(
  tints: CharacterGearHintTints,
  dungeon: GearHintDungeon,
  locale: AppLocale,
): CharacterGearHints {
  const hints: CharacterGearHints = {};
  if (tints.main) {
    hints.main = withBossLootGroups(tints.main, dungeon, locale);
  }
  if (tints.off) {
    hints.off = withBossLootGroups(tints.off, dungeon, locale);
  }
  return hints;
}

export function evaluateCharacterGearHints(
  character: CharacterRecord,
  dungeon: GearHintDungeon,
  getBisSlotMapForSpec: GetBisSlotMapForSpec,
  locale: AppLocale,
): CharacterGearHints {
  return evaluateCharacterGearHintsFromTints(
    evaluateCharacterGearHintTints(character, dungeon, getBisSlotMapForSpec),
    dungeon,
    locale,
  );
}

function specHintIsActive(
  hint:
    | SpecGearHintCore
    | SpecGearHint
    | undefined,
): boolean {
  if (!hint) {
    return false;
  }

  const hasBossGroups =
    "bisBossLootGroups" in hint &&
    (hint.bisBossLootGroups.length > 0 ||
      hint.bisVariantBossLootGroups.length > 0 ||
      hint.ilvlBossLootGroups.length > 0);

  return (
    hint.gearHint.bis.level > 0 ||
    hint.gearHint.bisVariant.level > 0 ||
    hint.gearHint.ilvl.level > 0 ||
    hint.tierSetHint.tokenNeeds.length > 0 ||
    hasBossGroups
  );
}

export function hasAnyGearHint(
  hints: CharacterGearHints | CharacterGearHintTints,
): boolean {
  return Boolean(specHintIsActive(hints.main) || specHintIsActive(hints.off));
}
