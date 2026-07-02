import {
  MAX_CHARACTER_GEAR_SCORE,
  MIN_CHARACTER_GEAR_SCORE,
} from "../constants/character.ts";
import { parseOptionalGearScore } from "./parse-optional-gear-score.ts";

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
