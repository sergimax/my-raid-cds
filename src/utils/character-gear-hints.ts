import type { ClassName, CharacterRecord, CharacterSpecGear } from "../types/characters.ts";
import type { DungeonRecord } from "../types/dungeons.ts";
import type { TierSetHint } from "../types/tier-sets.ts";
import type { BisSlotMap } from "./bis-lists.ts";
import {
  evaluateGearUpgradeHint,
  type GearUpgradeHint,
} from "./gear-upgrade-hint.ts";
import { evaluateTierSetHint } from "./tier-set-hint.ts";

export type SpecGearHint = {
  specGear: CharacterSpecGear;
  gearHint: GearUpgradeHint;
  tierSetHint: TierSetHint;
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
  dungeon: Pick<DungeonRecord, "name" | "raidKey" | "itemLevel">,
  getBisSlotMapForSpec: GetBisSlotMapForSpec,
): SpecGearHint {
  const slotMap = getBisSlotMapForSpec(className, specGear.spec);
  const bisSlotMap = slotMap.size > 0 ? slotMap : undefined;
  const equipContext = { className, spec: specGear.spec };

  return {
    specGear,
    gearHint: evaluateGearUpgradeHint(
      specGear.gearItems,
      dungeon,
      bisSlotMap,
      equipContext,
    ),
    tierSetHint: evaluateTierSetHint(specGear.gearItems, dungeon, bisSlotMap),
  };
}

export function evaluateCharacterGearHints(
  character: CharacterRecord,
  dungeon: Pick<DungeonRecord, "name" | "raidKey" | "itemLevel" | "size" | "difficulty">,
  getBisSlotMapForSpec: GetBisSlotMapForSpec,
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
    );
  }

  if (character.offSpec) {
    hints.off = evaluateSpecGearHint(
      character.offSpec,
      className,
      dungeon,
      getBisSlotMapForSpec,
    );
  }

  return hints;
}

export function hasAnyGearHint(hints: CharacterGearHints): boolean {
  const mainActive =
    hints.main &&
    (hints.main.gearHint.level > 0 ||
      hints.main.tierSetHint.tokenNeeds.length > 0);
  const offActive =
    hints.off &&
    (hints.off.gearHint.level > 0 || hints.off.tierSetHint.tokenNeeds.length > 0);
  return Boolean(mainActive || offActive);
}
