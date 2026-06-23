import {
  MAX_CHARACTER_GEAR_SCORE,
  MAX_CHARACTER_NAME_LENGTH,
  MIN_CHARACTER_GEAR_SCORE,
} from "../constants/character.ts";
import { isSpecValidForClass } from "../data/class-specs.ts";
import type {
  CharacterClass,
  CharacterRecord,
  CharacterSpecGear,
} from "../types/characters.ts";
import { parseOptionalPositiveInteger } from "./parse-optional-positive-integer.ts";

export type CharacterFormValues = {
  name: string;
  characterClass: CharacterClass | "";
  mainSpec: string;
  mainGearScoreText: string;
  offSpec: string;
  offGearScoreText: string;
};

export type ParsedCharacterFields = {
  name: string;
  characterClass: CharacterClass;
  mainSpec?: CharacterSpecGear;
  offSpec?: CharacterSpecGear;
};

export type ParseCharacterFormResult =
  | { ok: true } & ParsedCharacterFields
  | { ok: false; error: string };

export type CharacterSpecGearFormValues = Pick<
  CharacterFormValues,
  "mainSpec" | "mainGearScoreText" | "offSpec" | "offGearScoreText"
>;

export type ParseCharacterSpecGearResult =
  | {
      ok: true;
      mainSpec?: CharacterSpecGear;
      offSpec?: CharacterSpecGear;
    }
  | { ok: false; error: string };

function parseGearScoreField(text: string): number | undefined | typeof Number.NaN {
  const value = parseOptionalPositiveInteger(text);
  if (value === undefined || Number.isNaN(value)) {
    return value;
  }
  if (value < MIN_CHARACTER_GEAR_SCORE || value > MAX_CHARACTER_GEAR_SCORE) {
    return Number.NaN;
  }
  return value;
}

function parseSpecGearPair(
  specValue: string,
  gearScoreText: string,
  specLabel: string,
): CharacterSpecGear | undefined | { error: string } {
  const spec = specValue.trim() || undefined;
  const gearScore = parseGearScoreField(gearScoreText);

  if (Number.isNaN(gearScore)) {
    return {
      error: `${specLabel} gear score must be a whole number from ${MIN_CHARACTER_GEAR_SCORE} to ${MAX_CHARACTER_GEAR_SCORE}.`,
    };
  }

  if (!spec && gearScore !== undefined) {
    return {
      error: `Choose a ${specLabel.toLowerCase()} specialization to attach a gear score.`,
    };
  }

  if (!spec) {
    return undefined;
  }

  return gearScore !== undefined ? { spec, gearScore } : { spec };
}

export function parseCharacterSpecGearFields(
  values: CharacterSpecGearFormValues,
  characterClass: CharacterClass,
): ParseCharacterSpecGearResult {
  const mainResult = parseSpecGearPair(
    values.mainSpec,
    values.mainGearScoreText,
    "Main spec",
  );
  if (mainResult && "error" in mainResult) {
    return { ok: false, error: mainResult.error };
  }

  const offResult = parseSpecGearPair(
    values.offSpec,
    values.offGearScoreText,
    "Off spec",
  );
  if (offResult && "error" in offResult) {
    return { ok: false, error: offResult.error };
  }

  const mainSpec = mainResult;
  const offSpec = offResult;

  if (mainSpec && !isSpecValidForClass(characterClass.name, mainSpec.spec)) {
    return { ok: false, error: "Choose a valid main specialization for this class." };
  }
  if (offSpec && !isSpecValidForClass(characterClass.name, offSpec.spec)) {
    return { ok: false, error: "Choose a valid off specialization for this class." };
  }
  if (mainSpec && offSpec && mainSpec.spec === offSpec.spec) {
    return {
      ok: false,
      error: "Main and off specialization must be different.",
    };
  }

  return { ok: true, mainSpec, offSpec };
}

export function parseCharacterForm(
  values: CharacterFormValues,
  existingCharacters: CharacterRecord[],
): ParseCharacterFormResult {
  const trimmedName = values.name.trim();
  const { characterClass } = values;
  if (!trimmedName || !characterClass) {
    return { ok: false, error: "Enter a name and choose a class." };
  }
  if (trimmedName.length > MAX_CHARACTER_NAME_LENGTH) {
    return {
      ok: false,
      error: `Character name must be at most ${MAX_CHARACTER_NAME_LENGTH} characters.`,
    };
  }
  const isDuplicate = existingCharacters.some(
    (existing) =>
      existing.name.toLowerCase() === trimmedName.toLowerCase() &&
      existing.class?.name === characterClass.name,
  );
  if (isDuplicate) {
    return {
      ok: false,
      error: "A character with this name and class already exists.",
    };
  }

  const specGearResult = parseCharacterSpecGearFields(values, characterClass);
  if (!specGearResult.ok) {
    return specGearResult;
  }

  return {
    ok: true,
    name: trimmedName,
    characterClass,
    mainSpec: specGearResult.mainSpec,
    offSpec: specGearResult.offSpec,
  };
}

export function characterSpecGearFormValues(
  character: CharacterRecord,
): CharacterSpecGearFormValues {
  return {
    mainSpec: character.mainSpec?.spec ?? "",
    mainGearScoreText:
      character.mainSpec?.gearScore !== undefined
        ? String(character.mainSpec.gearScore)
        : "",
    offSpec: character.offSpec?.spec ?? "",
    offGearScoreText:
      character.offSpec?.gearScore !== undefined
        ? String(character.offSpec.gearScore)
        : "",
  };
}
