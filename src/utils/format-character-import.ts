import { shortSpecName } from "../data/class-specs.ts";
import type { ClassName, CharacterRecord, CharacterSpecGear } from "../types/characters.ts";
import { formatCompactGearScore } from "./format-character-details.ts";

function formatSpecImportPart(
  className: ClassName,
  specGear: CharacterSpecGear,
): string {
  const shortName = shortSpecName(className, specGear.spec);
  if (specGear.gearScore !== undefined) {
    return `${shortName} ${formatCompactGearScore(specGear.gearScore)}`;
  }
  return shortName;
}

/** Compact roster label: Name MainShort mainGs \\ OffShort offGs */
export function formatCharacterImportLabel(character: CharacterRecord): string {
  const className = character.class?.name;
  const mainPart =
    character.mainSpec && className
      ? formatSpecImportPart(className, character.mainSpec)
      : null;
  const offPart =
    character.offSpec && className
      ? formatSpecImportPart(className, character.offSpec)
      : null;

  if (mainPart && offPart) {
    return `${character.name} ${mainPart} \\ ${offPart}`;
  }
  if (mainPart) {
    return `${character.name} ${mainPart}`;
  }
  if (offPart) {
    return `${character.name} ${offPart}`;
  }
  return character.name;
}
