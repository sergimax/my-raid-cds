import equipPropsJson from "./wotlk-item-equip-props.json";

/** Compact WowSims item fields used for class/spec equip checks (from build:wow-data). */
export type WotlkItemEquipProps = {
  /** ItemType */
  t: number;
  /** ArmorType */
  a?: number;
  /** WeaponType */
  w?: number;
  /** HandType */
  h?: number;
  /** RangedWeaponType */
  r?: number;
  /** WowSims Class enum values */
  c?: readonly number[];
};

const equipPropsByItemId = equipPropsJson as Record<string, WotlkItemEquipProps>;

export function getWotlkItemEquipProps(itemId: number): WotlkItemEquipProps | undefined {
  return equipPropsByItemId[String(itemId)];
}
