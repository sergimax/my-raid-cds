import { getLocalizedSpecName } from "../i18n/localized-domain.ts";
import type { AppLocale } from "../i18n/types.ts";
import type { ClassName, CharacterRecord, CharacterSpecGear } from "../types/characters.ts";
import { formatExportGearScore } from "./format-character-details.ts";
import {
  DEFAULT_EXPORT_ROLE_FILTER,
  specPassesExportRoleFilter,
  type ExportRoleFilter,
} from "./export-spec-role.ts";

export type CharacterExportSpecSelection = {
  includeMain: boolean;
  includeOff: boolean;
  /** For characters with no specs: include name-only in export lines. */
  includeWithoutSpec: boolean;
};

export type ExportSpecSelectionByCharacterId = Readonly<
  Record<string, Partial<CharacterExportSpecSelection>>
>;

export function characterHasExportSpecs(
  character: Pick<CharacterRecord, "mainSpec" | "offSpec">,
): boolean {
  return Boolean(character.mainSpec || character.offSpec);
}

export function defaultExportSpecSelection(
  character: Pick<CharacterRecord, "mainSpec" | "offSpec">,
): CharacterExportSpecSelection {
  return {
    includeMain: Boolean(character.mainSpec),
    includeOff: Boolean(character.offSpec),
    includeWithoutSpec: true,
  };
}

export function resolveExportSpecSelection(
  character: CharacterRecord,
  exportSpecSelectionByCharacterId?: ExportSpecSelectionByCharacterId,
): CharacterExportSpecSelection {
  const defaults = defaultExportSpecSelection(character);
  const stored = exportSpecSelectionByCharacterId?.[character.id];
  return {
    includeMain: character.mainSpec
      ? (stored?.includeMain ?? defaults.includeMain)
      : false,
    includeOff: character.offSpec
      ? (stored?.includeOff ?? defaults.includeOff)
      : false,
    includeWithoutSpec: stored?.includeWithoutSpec ?? defaults.includeWithoutSpec,
  };
}

export function isSpecIncludedForExportRole(
  character: Pick<CharacterRecord, "class">,
  spec: string,
  roleFilter: ExportRoleFilter = DEFAULT_EXPORT_ROLE_FILTER,
): boolean {
  return specPassesExportRoleFilter(character.class?.name, spec, roleFilter);
}

/** Stored spec toggles with the role filter applied for display and export lines. */
export function resolveEffectiveExportSpecSelection(
  character: CharacterRecord,
  exportSpecSelectionByCharacterId?: ExportSpecSelectionByCharacterId,
  roleFilter: ExportRoleFilter = DEFAULT_EXPORT_ROLE_FILTER,
): CharacterExportSpecSelection {
  const selection = resolveExportSpecSelection(
    character,
    exportSpecSelectionByCharacterId,
  );

  return {
    includeMain:
      selection.includeMain &&
      (!character.mainSpec ||
        isSpecIncludedForExportRole(character, character.mainSpec.spec, roleFilter)),
    includeOff:
      selection.includeOff &&
      (!character.offSpec ||
        isSpecIncludedForExportRole(character, character.offSpec.spec, roleFilter)),
    includeWithoutSpec: selection.includeWithoutSpec,
  };
}

export function isCharacterIncludedInExport(
  character: Pick<CharacterRecord, "mainSpec" | "offSpec">,
  selection: CharacterExportSpecSelection,
): boolean {
  if (!characterHasExportSpecs(character)) {
    return selection.includeWithoutSpec;
  }
  return selection.includeMain || selection.includeOff;
}

export function specPassesExportMinGearScore(
  specGear: CharacterSpecGear,
  minGearScore?: number,
): boolean {
  if (minGearScore === undefined) {
    return true;
  }
  if (specGear.gearScore === undefined) {
    return true;
  }
  return specGear.gearScore >= minGearScore;
}

function formatSpecExportSegment(
  className: ClassName,
  specGear: CharacterSpecGear,
  locale: AppLocale = "en",
): string {
  const spec = getLocalizedSpecName(className, specGear.spec, locale, true);
  if (specGear.gearScore !== undefined) {
    return `${spec} ${formatExportGearScore(specGear.gearScore)}`;
  }
  return spec;
}

/**
 * Compact roster label: `Name: MainShort mainGs, OffShort offGs`.
 * Returns `null` when the character should be omitted from export lines.
 */
export function formatCharacterExportLabel(
  character: CharacterRecord,
  selection: CharacterExportSpecSelection = defaultExportSpecSelection(character),
  locale: AppLocale = "en",
  minGearScore?: number,
): string | null {
  if (!isCharacterIncludedInExport(character, selection)) {
    return null;
  }

  const className = character.class?.name;
  const specSegments: string[] = [];

  if (
    selection.includeMain &&
    character.mainSpec &&
    className &&
    specPassesExportMinGearScore(character.mainSpec, minGearScore)
  ) {
    specSegments.push(formatSpecExportSegment(className, character.mainSpec, locale));
  }
  if (
    selection.includeOff &&
    character.offSpec &&
    className &&
    specPassesExportMinGearScore(character.offSpec, minGearScore)
  ) {
    specSegments.push(formatSpecExportSegment(className, character.offSpec, locale));
  }

  if (specSegments.length === 0) {
    if (characterHasExportSpecs(character)) {
      return null;
    }
    return character.name;
  }

  return `${character.name}: ${specSegments.join(", ")}`;
}
