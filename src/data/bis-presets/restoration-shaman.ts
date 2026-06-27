import { ClassName } from "../../types/characters.ts";
import type { BuiltInSpecBis } from "../../types/bis-lists.ts";

/** WotLK BiS (ICC / RS tier) — Titans guild (Shaman / Restoration). */
export const restorationShamanBis: BuiltInSpecBis = {
  className: ClassName.Shaman,
  spec: "Restoration",
  presets: [
    {
      id: "titans",
      name: "Titans",
      slots: [
        { slot: 0, itemIds: [51247] },
        { slot: 1, itemIds: [50724] },
        { slot: 2, itemIds: [51245] },
        { slot: 3, itemIds: [54583] },
        { slot: 4, itemIds: [51249] },
        { slot: 5, itemIds: [54584] },
        { slot: 6, itemIds: [50703] },
        { slot: 7, itemIds: [54587] },
        { slot: 8, itemIds: [51246] },
        { slot: 9, itemIds: [50699] },
        { slot: 10, itemIds: [50664] },
        { slot: 11, itemIds: [54585] },
        { slot: 12, itemIds: [54589] },
        { slot: 13, itemIds: [50366] },
        { slot: 14, itemIds: [50734] },
      ],
    },
  ],
};
