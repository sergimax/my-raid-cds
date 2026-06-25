import type { CharacterSpecGear, CharacterRecord } from "../types/characters.ts";

export function formatCompactGearScore(gearScore: number): string {
  if (gearScore < 1000) {
    return String(gearScore);
  }
  const thousands = Math.floor((gearScore / 1000) * 10) / 10;
  if (Number.isInteger(thousands)) {
    return `${thousands}k`;
  }
  return `${thousands.toFixed(1)}k`;
}

export function formatSpecGearLine(pair: CharacterSpecGear): string {
  if (pair.gearScore !== undefined) {
    return `${pair.spec} · ${formatCompactGearScore(pair.gearScore)}`;
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
