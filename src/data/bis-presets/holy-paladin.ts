import { ClassName } from "../../types/characters.ts";
import type { BuiltInSpecBis } from "../../types/bis-lists.ts";

/** WotLK BiS (ICC / RS tier) — Titans guild (Paladin / Holy). */
export const holyPaladinBis: BuiltInSpecBis = {
  className: ClassName.Paladin,
  spec: "Holy",
  presets: [
    {
      id: "titans",
      name: "Titans",
      slots: [
        { slot: 0, itemIds: [51272] },
        { slot: 1, itemIds: [50724] },
        { slot: 2, itemIds: [51273] },
        { slot: 3, itemIds: [54583] },
        { slot: 4, itemIds: [50680] },
        { slot: 5, itemIds: [54584] },
        { slot: 6, itemIds: [50650] },
        { slot: 7, itemIds: [54587] },
        { slot: 8, itemIds: [49891] },
        { slot: 9, itemIds: [54586] },
        { slot: 10, itemIds: [50664] },
        { slot: 11, itemIds: [54585] },
        { slot: 12, itemIds: [54589] },
        { slot: 14, itemIds: [50734] },
        { slot: 15, itemIds: [50672] },
      ],
    },
  ],
};
