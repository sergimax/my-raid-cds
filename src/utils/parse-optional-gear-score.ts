import {
  MAX_CHARACTER_GEAR_SCORE,
  MIN_CHARACTER_GEAR_SCORE,
} from "../constants/character.ts";
import { parseOptionalPositiveInteger } from "./parse-optional-positive-integer.ts";

/** Parse optional gear score text; empty → `undefined`, invalid → `NaN`. */
export function parseOptionalGearScore(
  text: string,
): number | undefined | typeof Number.NaN {
  const value = parseOptionalPositiveInteger(text);
  if (value === undefined || Number.isNaN(value)) {
    return value;
  }
  if (value < MIN_CHARACTER_GEAR_SCORE || value > MAX_CHARACTER_GEAR_SCORE) {
    return Number.NaN;
  }
  return value;
}
