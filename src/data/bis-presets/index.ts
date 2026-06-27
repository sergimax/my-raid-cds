import type { ClassName } from "../../types/characters.ts";
import type { BisListPreset, BuiltInSpecBis } from "../../types/bis-lists.ts";
import { unholyDeathKnightBis } from "./unholy-death-knight.ts";
import { enhancementShamanBis } from "./enhancement-shaman.ts";
import { feralDruidBis } from "./feral-druid.ts";
import { restorationDruidBis } from "./restoration-druid.ts";

export const BuiltInBisPresets: readonly BuiltInSpecBis[] = [
  unholyDeathKnightBis,
  enhancementShamanBis,
  feralDruidBis,
  restorationDruidBis,
];

export function findBuiltInSpecBis(
  className: ClassName,
  spec: string,
): BuiltInSpecBis | undefined {
  return BuiltInBisPresets.find(
    (entry) => entry.className === className && entry.spec === spec,
  );
}

export function getBuiltInPresetsForSpec(
  className: ClassName,
  spec: string,
): readonly BisListPreset[] {
  return findBuiltInSpecBis(className, spec)?.presets ?? [];
}
