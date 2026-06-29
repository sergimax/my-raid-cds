import { ClassName } from "../../types/characters.ts";
import type { BuiltInSpecBis } from "../../types/bis-lists.ts";

/**
 * WotLK BiS presets for Frost Mage (community sources).
 * @see https://www.icy-veins.com/wotlk-classic/frost-mage-dps-pve-gear-best-in-slot
 */
export const frostMageBis: BuiltInSpecBis = {
  className: ClassName.Mage,
  spec: "Frost",
  presets: [
    {
      id: "icy-veins-wrdlbrmpft-frost",
      name: "Frost (icy-veins · Wrdlbrmpft)",
      slots: [
        { slot: 0, itemIds: [51281] },
        { slot: 1, itemIds: [50724] },
        { slot: 2, itemIds: [51284] },
        { slot: 3, itemIds: [54583] },
        { slot: 4, itemIds: [51283] },
        { slot: 5, itemIds: [54582] },
        { slot: 6, itemIds: [51280] },
        { slot: 7, itemIds: [50613] },
        { slot: 8, itemIds: [51282] },
        { slot: 9, itemIds: [50699] },
        { slot: 10, itemIds: [50398] },
        { slot: 11, itemIds: [50664] },
        { slot: 12, itemIds: [54588] },
        { slot: 13, itemIds: [50365] },
        { slot: 14, itemIds: [50732] },
        { slot: 15, itemIds: [50719] },
        { slot: 16, itemIds: [50684] },
      ],
    },
  ],
};
