import { shortSpecName } from "../data/class-specs.ts";
import type { ClassName, CharacterRecord, CharacterSpecGear } from "../types/characters.ts";
import { formatExportGearScore } from "./format-character-details.ts";

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

export function isCharacterIncludedInExport(
  character: Pick<CharacterRecord, "mainSpec" | "offSpec">,
  selection: CharacterExportSpecSelection,
): boolean {
  if (!characterHasExportSpecs(character)) {
    return selection.includeWithoutSpec;
  }
  return selection.includeMain || selection.includeOff;
}

function formatSpecExportSegment(
  className: ClassName,
  specGear: CharacterSpecGear,
): string {
  const spec = shortSpecName(className, specGear.spec);
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
): string | null {
  if (!isCharacterIncludedInExport(character, selection)) {
    return null;
  }

  const className = character.class?.name;
  const specSegments: string[] = [];

  if (selection.includeMain && character.mainSpec && className) {
    specSegments.push(formatSpecExportSegment(className, character.mainSpec));
  }
  if (selection.includeOff && character.offSpec && className) {
    specSegments.push(formatSpecExportSegment(className, character.offSpec));
  }

  if (specSegments.length === 0) {
    return character.name;
  }

  return `${character.name}: ${specSegments.join(", ")}`;
}
