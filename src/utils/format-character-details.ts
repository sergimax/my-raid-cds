import type { CharacterSpecGear, CharacterRecord } from "../types/characters.ts";

export function formatSpecGearLine(pair: CharacterSpecGear): string {
  if (pair.gearScore !== undefined) {
    return `${pair.spec} · ${pair.gearScore}`;
  }
  return pair.spec;
}

export function formatCharacterSpecGearSummary(
  character: Pick<CharacterRecord, "mainSpec" | "offSpec">,
): string | null {
  const parts: string[] = [];
  if (character.mainSpec) {
    parts.push(formatSpecGearLine(character.mainSpec));
  }
  if (character.offSpec) {
    parts.push(formatSpecGearLine(character.offSpec));
  }
  return parts.length > 0 ? parts.join(" / ") : null;
}

export function formatCharacterDetailsTooltip(character: CharacterRecord): string {
  const specGearSummary = formatCharacterSpecGearSummary(character);
  if (!specGearSummary) {
    return character.name;
  }
  return `${character.name}\n${specGearSummary}`;
}
