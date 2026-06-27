import type { CharacterGearItem } from "../../types/character-gear.ts";
import type { CharacterSpecGear } from "../../types/characters.ts";

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
