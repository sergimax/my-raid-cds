import type { ClassName } from "../../types/characters.ts";
import type { BisListPreset, BuiltInSpecBis } from "../../types/bis-lists.ts";
import { bloodDeathKnightBis } from "./blood-death-knight.ts";
import { unholyDeathKnightBis } from "./unholy-death-knight.ts";

export const BuiltInBisPresets: readonly BuiltInSpecBis[] = [
  bloodDeathKnightBis,
  unholyDeathKnightBis,
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
