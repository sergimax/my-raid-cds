import { getWotlkItemEquipProps } from "../data/wotlk-item-equip-props.ts";
import { getSpecStatProfile } from "../data/spec-stat-priorities.ts";
import { isItemStatUsableForSpec } from "./item-stat-fit.ts";
import { ClassName, type ClassName as ClassNameType } from "../types/characters.ts";

/** WowSims Class enum (proto/common.proto). */
const WowSimsClass = {
  Druid: 1,
  Hunter: 2,
  Mage: 3,
  Paladin: 4,
  Priest: 5,
  Rogue: 6,
  Shaman: 7,
  Warlock: 8,
  Warrior: 9,
  DeathKnight: 10,
} as const;

const ItemType = {
  Finger: 11,
  Trinket: 12,
  Weapon: 13,
  Ranged: 14,
} as const;

const ArmorType = {
  Cloth: 1,
  Leather: 2,
  Mail: 3,
  Plate: 4,
} as const;

const WeaponType = {
  Axe: 1,
  Dagger: 2,
  Fist: 3,
  Mace: 4,
  OffHand: 5,
  Polearm: 6,
  Shield: 7,
  Staff: 8,
  Sword: 9,
} as const;

const HandType = {
  MainHand: 1,
  OneHand: 2,
  OffHand: 3,
  TwoHand: 4,
} as const;

const RangedWeaponType = {
  Bow: 1,
  Crossbow: 2,
  Gun: 3,
  Idol: 4,
  Libram: 5,
  Thrown: 6,
  Totem: 7,
  Wand: 8,
  Sigil: 9,
} as const;

const GearSlot = {
  MainHand: 14,
  OffHand: 15,
} as const;

const classNameToWowSimsClass: Record<ClassNameType, number> = {
  [ClassName.Druid]: WowSimsClass.Druid,
  [ClassName.Hunter]: WowSimsClass.Hunter,
  [ClassName.Mage]: WowSimsClass.Mage,
  [ClassName.Paladin]: WowSimsClass.Paladin,
  [ClassName.Priest]: WowSimsClass.Priest,
  [ClassName.Rogue]: WowSimsClass.Rogue,
  [ClassName.Shaman]: WowSimsClass.Shaman,
  [ClassName.Warlock]: WowSimsClass.Warlock,
  [ClassName.Warrior]: WowSimsClass.Warrior,
  [ClassName.DeathKnight]: WowSimsClass.DeathKnight,
};

const classToMaxArmorType: Record<number, number> = {
  [WowSimsClass.Druid]: ArmorType.Leather,
  [WowSimsClass.Hunter]: ArmorType.Mail,
  [WowSimsClass.Mage]: ArmorType.Cloth,
  [WowSimsClass.Paladin]: ArmorType.Plate,
  [WowSimsClass.Priest]: ArmorType.Cloth,
  [WowSimsClass.Rogue]: ArmorType.Leather,
  [WowSimsClass.Shaman]: ArmorType.Mail,
  [WowSimsClass.Warlock]: ArmorType.Cloth,
  [WowSimsClass.Warrior]: ArmorType.Plate,
  [WowSimsClass.DeathKnight]: ArmorType.Plate,
};

const classToEligibleRangedWeaponTypes: Record<number, readonly number[]> = {
  [WowSimsClass.Druid]: [RangedWeaponType.Idol],
  [WowSimsClass.Hunter]: [
    RangedWeaponType.Bow,
    RangedWeaponType.Crossbow,
    RangedWeaponType.Gun,
  ],
  [WowSimsClass.Mage]: [RangedWeaponType.Wand],
  [WowSimsClass.Paladin]: [RangedWeaponType.Libram],
  [WowSimsClass.Priest]: [RangedWeaponType.Wand],
  [WowSimsClass.Rogue]: [
    RangedWeaponType.Bow,
    RangedWeaponType.Crossbow,
    RangedWeaponType.Gun,
    RangedWeaponType.Thrown,
  ],
  [WowSimsClass.Shaman]: [RangedWeaponType.Totem],
  [WowSimsClass.Warlock]: [RangedWeaponType.Wand],
  [WowSimsClass.Warrior]: [
    RangedWeaponType.Bow,
    RangedWeaponType.Crossbow,
    RangedWeaponType.Gun,
    RangedWeaponType.Thrown,
  ],
  [WowSimsClass.DeathKnight]: [RangedWeaponType.Sigil],
};

type EligibleWeaponType = {
  weaponType: number;
  canUseTwoHand?: boolean;
};

const classToEligibleWeaponTypes: Record<number, readonly EligibleWeaponType[]> = {
  [WowSimsClass.Druid]: [
    { weaponType: WeaponType.Dagger },
    { weaponType: WeaponType.Fist },
    { weaponType: WeaponType.Mace, canUseTwoHand: true },
    { weaponType: WeaponType.OffHand },
    { weaponType: WeaponType.Staff, canUseTwoHand: true },
    { weaponType: WeaponType.Polearm, canUseTwoHand: true },
  ],
  [WowSimsClass.Hunter]: [
    { weaponType: WeaponType.Axe, canUseTwoHand: true },
    { weaponType: WeaponType.Dagger },
    { weaponType: WeaponType.Fist },
    { weaponType: WeaponType.OffHand },
    { weaponType: WeaponType.Polearm, canUseTwoHand: true },
    { weaponType: WeaponType.Sword, canUseTwoHand: true },
    { weaponType: WeaponType.Staff, canUseTwoHand: true },
  ],
  [WowSimsClass.Mage]: [
    { weaponType: WeaponType.Dagger },
    { weaponType: WeaponType.OffHand },
    { weaponType: WeaponType.Staff, canUseTwoHand: true },
    { weaponType: WeaponType.Sword },
  ],
  [WowSimsClass.Paladin]: [
    { weaponType: WeaponType.Axe, canUseTwoHand: true },
    { weaponType: WeaponType.Mace, canUseTwoHand: true },
    { weaponType: WeaponType.OffHand },
    { weaponType: WeaponType.Polearm, canUseTwoHand: true },
    { weaponType: WeaponType.Shield },
    { weaponType: WeaponType.Sword, canUseTwoHand: true },
  ],
  [WowSimsClass.Priest]: [
    { weaponType: WeaponType.Dagger },
    { weaponType: WeaponType.Mace },
    { weaponType: WeaponType.OffHand },
    { weaponType: WeaponType.Staff, canUseTwoHand: true },
  ],
  [WowSimsClass.Rogue]: [
    { weaponType: WeaponType.Axe },
    { weaponType: WeaponType.Dagger },
    { weaponType: WeaponType.Fist },
    { weaponType: WeaponType.Mace },
    { weaponType: WeaponType.OffHand },
    { weaponType: WeaponType.Sword },
  ],
  [WowSimsClass.Shaman]: [
    { weaponType: WeaponType.Axe, canUseTwoHand: true },
    { weaponType: WeaponType.Dagger },
    { weaponType: WeaponType.Fist },
    { weaponType: WeaponType.Mace, canUseTwoHand: true },
    { weaponType: WeaponType.OffHand },
    { weaponType: WeaponType.Shield },
    { weaponType: WeaponType.Staff, canUseTwoHand: true },
  ],
  [WowSimsClass.Warlock]: [
    { weaponType: WeaponType.Dagger },
    { weaponType: WeaponType.OffHand },
    { weaponType: WeaponType.Staff, canUseTwoHand: true },
    { weaponType: WeaponType.Sword },
  ],
  [WowSimsClass.Warrior]: [
    { weaponType: WeaponType.Axe, canUseTwoHand: true },
    { weaponType: WeaponType.Dagger },
    { weaponType: WeaponType.Fist },
    { weaponType: WeaponType.Mace, canUseTwoHand: true },
    { weaponType: WeaponType.OffHand },
    { weaponType: WeaponType.Polearm, canUseTwoHand: true },
    { weaponType: WeaponType.Shield },
    { weaponType: WeaponType.Staff, canUseTwoHand: true },
    { weaponType: WeaponType.Sword, canUseTwoHand: true },
  ],
  [WowSimsClass.DeathKnight]: [
    { weaponType: WeaponType.Axe, canUseTwoHand: true },
    { weaponType: WeaponType.Mace, canUseTwoHand: true },
    { weaponType: WeaponType.Polearm, canUseTwoHand: true },
    { weaponType: WeaponType.Sword, canUseTwoHand: true },
  ],
};

export type CharacterEquipContext = {
  className?: ClassNameType;
  spec?: string;
};

function canDualWield(className: ClassNameType, spec?: string): boolean {
  switch (className) {
    case ClassName.Hunter:
    case ClassName.Rogue:
    case ClassName.DeathKnight:
      return true;
    case ClassName.Shaman:
      return spec === "Enhancement";
    case ClassName.Warrior:
      return true;
    default:
      return false;
  }
}

/** Titan's Grip: Fury/Arms warriors may equip a 2H weapon in the off-hand slot. */
function canEquipTwoHandInOffHand(className: ClassNameType, spec?: string): boolean {
  return className === ClassName.Warrior && spec !== "Protection";
}

/**
 * Returns whether an item may be equipped for the given class/spec and gear slot.
 * Mirrors WowSims `canEquipItem` (ui/core/proto_utils/utils.ts).
 */
export function canEquipItemForCharacter(
  itemId: number,
  gearSlot: number,
  context: CharacterEquipContext,
): boolean {
  const className = context.className;
  if (!className) {
    return true;
  }

  const item = getWotlkItemEquipProps(itemId);
  if (!item) {
    return true;
  }

  const playerClass = classNameToWowSimsClass[className];
  if (item.c && item.c.length > 0 && !item.c.includes(playerClass)) {
    return false;
  }

  if (item.t === ItemType.Finger || item.t === ItemType.Trinket) {
    return true;
  }

  if (item.t === ItemType.Weapon) {
    const weaponType = item.w ?? 0;
    const handType = item.h ?? 0;
    const eligibleWeaponType = classToEligibleWeaponTypes[playerClass]?.find(
      (entry) => entry.weaponType === weaponType,
    );
    if (!eligibleWeaponType) {
      return false;
    }

    const isOffHandSlot =
      handType === HandType.OffHand ||
      (handType === HandType.OneHand && gearSlot === GearSlot.OffHand);
    if (
      isOffHandSlot &&
      weaponType !== WeaponType.Shield &&
      weaponType !== WeaponType.OffHand &&
      !canDualWield(className, context.spec)
    ) {
      return false;
    }

    if (handType === HandType.TwoHand && !eligibleWeaponType.canUseTwoHand) {
      return false;
    }

    const specProfile =
      context.spec !== undefined
        ? getSpecStatProfile(className, context.spec)
        : undefined;
    if (
      specProfile?.mainHandTwoHandOnly === true &&
      gearSlot === GearSlot.MainHand &&
      handType !== HandType.TwoHand
    ) {
      return false;
    }

    if (
      handType === HandType.TwoHand &&
      gearSlot === GearSlot.OffHand &&
      !canEquipTwoHandInOffHand(className, context.spec)
    ) {
      return false;
    }

    return true;
  }

  if (item.t === ItemType.Ranged) {
    const rangedType = item.r ?? 0;
    return classToEligibleRangedWeaponTypes[playerClass]?.includes(rangedType) ?? false;
  }

  const armorType = item.a ?? 0;
  const maxArmorType = classToMaxArmorType[playerClass];
  return maxArmorType !== undefined && maxArmorType >= armorType;
}

export type FilterUsableLootOptions = {
  /** Drop loot whose stats look wrong for the selected spec (ilvl hints only). */
  filterBySpecStats?: boolean;
};

export function filterUsableLootItemIds(
  itemIds: readonly number[],
  gearSlot: number,
  context: CharacterEquipContext,
  options?: FilterUsableLootOptions,
): number[] {
  if (!context.className) {
    return [...itemIds];
  }

  return itemIds.filter((itemId) => {
    if (!canEquipItemForCharacter(itemId, gearSlot, context)) {
      return false;
    }
    if (
      options?.filterBySpecStats === true &&
      !isItemStatUsableForSpec(itemId, context, gearSlot)
    ) {
      return false;
    }
    return true;
  });
}
