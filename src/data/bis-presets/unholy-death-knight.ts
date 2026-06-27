import { ClassName } from "../../types/characters.ts";
import type { BuiltInSpecBis } from "../../types/bis-lists.ts";

/** Default WotLK BiS (ICC / RS tier) for Unholy Death Knight. */
export const unholyDeathKnightBis: BuiltInSpecBis = {
  className: ClassName.DeathKnight,
  spec: "Unholy",
  presets: [
    {
      id: "default",
      name: "Default",
      slots: [
        { slot: 0, itemIds: [51312] },
        { slot: 2, itemIds: [51314] },
        { slot: 4, itemIds: [51310] },
        { slot: 6, itemIds: [51311] },
        { slot: 8, itemIds: [50624] },
        { slot: 1, itemIds: [54581] },
        { slot: 3, itemIds: [50677] },
        { slot: 5, itemIds: [54580] },
        { slot: 7, itemIds: [50620] },
        { slot: 9, itemIds: [54578] },
        { slot: 10, itemIds: [52572] },
        { slot: 11, itemIds: [50693] },
        { slot: 12, itemIds: [50363] },
        { slot: 13, itemIds: [54590] },
        { slot: 14, itemIds: [49623] },
        { slot: 16, itemIds: [50459, 47673] },
      ],
    },
    {
      id: "titans",
      name: "Titans",
      slots: [
        { slot: 0, itemIds: [51312] },
        { slot: 1, itemIds: [54581] },
        { slot: 2, itemIds: [51314] },
        { slot: 3, itemIds: [50677] },
        { slot: 4, itemIds: [51310] },
        { slot: 5, itemIds: [50659] },
        { slot: 6, itemIds: [50690] },
        { slot: 7, itemIds: [50620] },
        { slot: 8, itemIds: [51313] },
        { slot: 9, itemIds: [54578] },
        { slot: 10, itemIds: [52572] },
        { slot: 11, itemIds: [50657] },
        { slot: 12, itemIds: [50363] },
        { slot: 13, itemIds: [54590] },
        { slot: 14, itemIds: [49623] },
      ],
    },
  ],
};
