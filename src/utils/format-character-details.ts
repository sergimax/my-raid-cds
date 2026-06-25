import type { CharacterSpecGear, CharacterRecord } from "../types/characters.ts";

function formatGearScoreShort(gearScore: number, suffix: "k" | ""): string {
  if (gearScore < 1000) {
    return String(gearScore);
  }
  const thousands = Math.floor((gearScore / 1000) * 10) / 10;
  const value = Number.isInteger(thousands)
    ? String(thousands)
    : thousands.toFixed(1);
  return suffix ? `${value}${suffix}` : value;
}

export function formatCompactGearScore(gearScore: number): string {
  return formatGearScoreShort(gearScore, "k");
}

/** Export lines: compact gear score without a thousands suffix (e.g. `6.6`). */
export function formatExportGearScore(gearScore: number): string {
  return formatGearScoreShort(gearScore, "");
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
