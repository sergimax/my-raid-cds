import {
  MAX_CHARACTER_GEAR_SCORE,
  MIN_CHARACTER_GEAR_SCORE,
} from "../constants/character.ts";
import { parseOptionalGearScore } from "./parse-optional-gear-score.ts";

/** Compact GS slider bounds for export min filter (raid recruit shorthand). */
export const EXPORT_MIN_GS_COMPACT_MIN = 4;
export const EXPORT_MIN_GS_COMPACT_MAX = 7;
export const EXPORT_MIN_GS_COMPACT_STEP = 0.1;
export const EXPORT_MIN_GS_COMPACT_DEFAULT = 5.6;

export function compactExportMinGearScoreToThreshold(compact: number): number {
  const gearScore = Math.floor(compact * 1000);
  if (gearScore < MIN_CHARACTER_GEAR_SCORE || gearScore > MAX_CHARACTER_GEAR_SCORE) {
    return Number.NaN;
  }
  return gearScore;
}

export function formatCompactExportMinGearScore(compact: number): string {
  return Number.isInteger(compact) ? String(compact) : compact.toFixed(1);
}

export function resolveExportMinGearScoreThreshold(
  enabled: boolean,
  compactValue: number,
): number | undefined {
  if (!enabled) {
    return undefined;
  }

  const threshold = compactExportMinGearScoreToThreshold(compactValue);
  return Number.isNaN(threshold) ? undefined : threshold;
}

/** Strip raid-chat suffixes: `5.6gs`, `5.6k`, `5.6к`. */
export function normalizeExportMinGearScoreInput(text: string): string {
  return text
    .trim()
    .replace(/\s*gs$/iu, "")
    .replace(/[kк]$/iu, "")
    .trim();
}

/**
 * Parse export min-GS filter: full value (`5600`) or compact shorthand (`5.6` → 5600),
 * matching export line / raid recruit format.
 */
export function parseExportMinGearScore(
  text: string,
): number | undefined | typeof Number.NaN {
  const normalized = normalizeExportMinGearScoreInput(text);
  if (!normalized) {
    return undefined;
  }

  const compactValue = Number(normalized.replace(",", "."));
  if (!Number.isFinite(compactValue) || compactValue <= 0) {
    return Number.NaN;
  }

  if (Number.isInteger(compactValue) && compactValue >= 1000) {
    return parseOptionalGearScore(normalized);
  }

  if (Number.isInteger(compactValue) && compactValue >= 10) {
    return Number.NaN;
  }

  const gearScore = Math.floor(compactValue * 1000);
  if (gearScore < MIN_CHARACTER_GEAR_SCORE || gearScore > MAX_CHARACTER_GEAR_SCORE) {
    return Number.NaN;
  }

  return gearScore;
}
