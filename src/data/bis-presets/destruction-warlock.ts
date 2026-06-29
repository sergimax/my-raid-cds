import { ClassName } from "../../types/characters.ts";
import type { BuiltInSpecBis } from "../../types/bis-lists.ts";

/**
 * WotLK BiS presets for Destruction Warlock (community sources).
 * @see https://www.icy-veins.com/wotlk-classic/destruction-warlock-dps-pve-gear-best-in-slot
 */
export const destructionWarlockBis: BuiltInSpecBis = {
  className: ClassName.Warlock,
  spec: "Destruction",
  presets: [
    {
      id: "icy-veins-abide-destruction",
      name: "Destruction (icy-veins · Abide)",
      slots: [
        { slot: 0, itemIds: [51231] },
        { slot: 1, itemIds: [50658] },
        { slot: 2, itemIds: [51234] },
        { slot: 3, itemIds: [50628] },
        { slot: 4, itemIds: [51233] },
        { slot: 5, itemIds: [50651] },
        { slot: 6, itemIds: [51230] },
        { slot: 7, itemIds: [50613] },
        { slot: 8, itemIds: [50694] },
        { slot: 9, itemIds: [50699] },
        { slot: 10, itemIds: [50398] },
        { slot: 11, itemIds: [50664] },
        { slot: 12, itemIds: [50365] },
        { slot: 13, itemIds: [50348] },
        { slot: 14, itemIds: [50732] },
        { slot: 15, itemIds: [50719] },
        { slot: 16, itemIds: [50684] },
      ],
    },
  ],
};
