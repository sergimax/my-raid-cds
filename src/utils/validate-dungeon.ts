import type { EmblemKey } from "../assets/emblems/emblem-icons.ts";
import { EmblemKey as EmblemKeyValues } from "../assets/emblems/emblem-icons.ts";
import {
  MAX_DUNGEON_SHORT_NAME_LENGTH,
  type DungeonFormValues,
} from "../constants/dungeon-form-defaults.ts";
import type {
  DungeonCustomizationUpdate,
  DungeonRecord,
} from "../types/dungeons.ts";
import { defaultShortNameForDungeonName } from "./dungeon-short-name.ts";
import { parseItemLevelInput } from "./parse-item-level-input.ts";

export type { DungeonFormValues } from "../constants/dungeon-form-defaults.ts";

export type DungeonCustomizationValues = {
  name: string;
  shortName: string;
  size: DungeonRecord["size"];
  difficulty: DungeonRecord["difficulty"];
  emblem: EmblemKey | "";
};

export type ParseDungeonCustomizationResult =
  | { ok: true; fields: DungeonCustomizationUpdate }
  | { ok: false; error: string };

const VALID_EMBLEM_KEYS = new Set<string>(Object.values(EmblemKeyValues));

export function dungeonCustomizationFormValues(
  dungeon: DungeonRecord,
): DungeonCustomizationValues {
  return {
    name: dungeon.name,
    shortName: dungeon.shortName ?? "",
    size: dungeon.size,
    difficulty: dungeon.difficulty,
    emblem: dungeon.emblem ?? "",
  };
}

export function parseDungeonCustomizationForm(
  values: DungeonCustomizationValues,
): ParseDungeonCustomizationResult {
  const trimmedName = values.name.trim();
  if (!trimmedName) {
    return { ok: false, error: "Enter a dungeon name." };
  }
  const trimmedShortName = values.shortName.trim();
  if (trimmedShortName.length > MAX_DUNGEON_SHORT_NAME_LENGTH) {
    return {
      ok: false,
      error: `Short name must be at most ${MAX_DUNGEON_SHORT_NAME_LENGTH} characters.`,
    };
  }
  const emblemValue = values.emblem.trim();
  if (emblemValue && !VALID_EMBLEM_KEYS.has(emblemValue)) {
    return { ok: false, error: "Choose a valid emblem badge." };
  }
  const shortName =
    trimmedShortName || defaultShortNameForDungeonName(trimmedName) || undefined;
  const emblem = emblemValue ? (emblemValue as EmblemKey) : undefined;
  return {
    ok: true,
    fields: {
      name: trimmedName,
      ...(shortName ? { shortName } : {}),
      size: values.size,
      difficulty: values.difficulty,
      ...(emblem ? { emblem } : {}),
    },
  };
}

export type ParsedDungeonFormFields = {
  name: string;
  shortName?: string;
  size: DungeonRecord["size"];
  itemLevel: number[];
  difficulty: DungeonRecord["difficulty"];
};

export type ParseDungeonFormResult =
  | { ok: true; fields: ParsedDungeonFormFields }
  | { ok: false; error: string };

export function parseDungeonForm(
  values: DungeonFormValues,
): ParseDungeonFormResult {
  const trimmedName = values.name.trim();
  if (!trimmedName) {
    return { ok: false, error: "Enter a dungeon name." };
  }
  const trimmedShortName = values.shortName.trim();
  if (trimmedShortName.length > MAX_DUNGEON_SHORT_NAME_LENGTH) {
    return {
      ok: false,
      error: `Short name must be at most ${MAX_DUNGEON_SHORT_NAME_LENGTH} characters.`,
    };
  }
  const itemLevels = parseItemLevelInput(values.itemLevelText);
  if (itemLevels.length === 0) {
    return {
      ok: false,
      error: "Enter at least one item level (e.g. 200 or range like 200 / 213).",
    };
  }
  const shortName =
    trimmedShortName || defaultShortNameForDungeonName(trimmedName) || undefined;
  return {
    ok: true,
    fields: {
      name: trimmedName,
      ...(shortName ? { shortName } : {}),
      size: values.size,
      itemLevel: itemLevels,
      difficulty: values.difficulty,
    },
  };
}
