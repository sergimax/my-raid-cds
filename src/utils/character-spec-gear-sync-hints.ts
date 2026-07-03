import type { CharacterGearItem } from "../types/character-gear.ts";

export type SpecGearSyncHints = {
  /** Gear score was edited without re-importing WowSimsExporter gear. */
  suggestImportGear: boolean;
  /** Imported gear changed without updating the gear score field. */
  suggestUpdateGearScore: boolean;
};

function normalizeGearScoreText(text: string): string {
  return text.trim();
}

export function areCharacterGearItemsEqual(
  left: readonly CharacterGearItem[] | undefined,
  right: readonly CharacterGearItem[] | undefined,
): boolean {
  if (left === right) {
    return true;
  }
  if (left === undefined || right === undefined) {
    return false;
  }
  if (left.length !== right.length) {
    return false;
  }

  const sortBySlot = (items: readonly CharacterGearItem[]) =>
    [...items].sort((leftItem, rightItem) => leftItem.slot - rightItem.slot);

  const sortedLeft = sortBySlot(left);
  const sortedRight = sortBySlot(right);

  return sortedLeft.every((item, index) => {
    const other = sortedRight[index];
    if (!other) {
      return false;
    }
    return (
      item.slot === other.slot &&
      item.id === other.id &&
      item.enchant === other.enchant &&
      JSON.stringify(item.gems ?? []) === JSON.stringify(other.gems ?? [])
    );
  });
}

export function getSpecGearSyncHints(options: {
  spec: string;
  initialGearScoreText: string;
  gearScoreText: string;
  initialGearItems: readonly CharacterGearItem[] | undefined;
  currentGearItems: readonly CharacterGearItem[] | undefined;
}): SpecGearSyncHints {
  const {
    spec,
    initialGearScoreText,
    gearScoreText,
    initialGearItems,
    currentGearItems,
  } = options;

  if (!spec) {
    return { suggestImportGear: false, suggestUpdateGearScore: false };
  }

  const gearScoreChanged =
    normalizeGearScoreText(gearScoreText) !==
    normalizeGearScoreText(initialGearScoreText);
  const gearChanged = !areCharacterGearItemsEqual(
    initialGearItems,
    currentGearItems,
  );

  if (gearScoreChanged && gearChanged) {
    return { suggestImportGear: false, suggestUpdateGearScore: false };
  }

  return {
    suggestImportGear:
      gearScoreChanged &&
      !gearChanged &&
      normalizeGearScoreText(gearScoreText) !== "",
    suggestUpdateGearScore: gearChanged && !gearScoreChanged,
  };
}
