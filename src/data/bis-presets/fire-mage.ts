import { ClassName } from "../../types/characters.ts";
import type { BuiltInSpecBis } from "../../types/bis-lists.ts";

/** WotLK BiS (ICC / RS tier) — Titans guild (Mage / Fire). */
export const fireMageBis: BuiltInSpecBis = {
  className: ClassName.Mage,
  spec: "Fire",
  presets: [
    {
      id: "titans",
      name: "Titans",
      slots: [
        { slot: 0, itemIds: [51281] },
        { slot: 1, itemIds: [50724] },
        { slot: 2, itemIds: [51284] },
        { slot: 3, itemIds: [54583] },
        { slot: 4, itemIds: [50629] },
        { slot: 5, itemIds: [54582] },
        { slot: 6, itemIds: [51280] },
        { slot: 7, itemIds: [50613] },
        { slot: 8, itemIds: [51282] },
        { slot: 9, itemIds: [50699] },
        { slot: 10, itemIds: [50398] },
        { slot: 11, itemIds: [50614] },
        { slot: 12, itemIds: [54588] },
        { slot: 13, itemIds: [50365] },
        { slot: 14, itemIds: [50732] },
        { slot: 15, itemIds: [50719] },
        { slot: 16, itemIds: [50684] },
      ],
    },
  ],
};
