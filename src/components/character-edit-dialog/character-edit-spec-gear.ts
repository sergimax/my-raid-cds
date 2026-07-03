import type { CharacterGearItem } from "../../types/character-gear.ts";
import type { CharacterSpecGear } from "../../types/characters.ts";

export type SpecGearSyncBaseline = {
  gearItems: CharacterGearItem[] | undefined;
  gearScoreText: string;
};

/** Baseline for sync hints when the dialog opens on the stored spec. */
export function initialSpecGearSyncBaseline(
  storedSpecGear: CharacterSpecGear | undefined,
  initialSpec: string,
  initialGearScoreText: string,
): SpecGearSyncBaseline {
  const specMatches =
    initialSpec !== "" && storedSpecGear?.spec === initialSpec;
  return {
    gearItems: specMatches ? storedSpecGear?.gearItems : undefined,
    gearScoreText: initialGearScoreText,
  };
}

/** Reset sync baselines when the user picks a different spec. */
export function specGearSyncBaselineAfterSpecChange(
  gearScoreText: string,
): SpecGearSyncBaseline {
  return {
    gearItems: undefined,
    gearScoreText,
  };
}

/** Spec name the current gear draft belongs to; empty when no gear is loaded. */
export function initialGearLoadedForSpec(
  specGear: CharacterSpecGear | undefined,
): string {
  if (specGear?.gearItems && specGear.gearItems.length > 0) {
    return specGear.spec;
  }
  return "";
}

export function gearItemsForSpecSave(
  specName: string | undefined,
  gearItems: CharacterGearItem[] | undefined,
  gearLoadedForSpec: string,
): CharacterGearItem[] | undefined {
  if (!specName || !gearItems || gearItems.length === 0) {
    return undefined;
  }
  return gearLoadedForSpec === specName ? gearItems : undefined;
}

export function attachGearToSpec(
  specGear: CharacterSpecGear | undefined,
  gearItems: CharacterGearItem[] | undefined,
): CharacterSpecGear | undefined {
  if (!specGear) {
    return undefined;
  }
  const next: CharacterSpecGear = { spec: specGear.spec };
  if (specGear.gearScore !== undefined) {
    next.gearScore = specGear.gearScore;
  }
  if (gearItems && gearItems.length > 0) {
    next.gearItems = gearItems;
  }
  return next;
}
