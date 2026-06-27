import { ClassName } from "../../types/characters.ts";
import type { BuiltInSpecBis } from "../../types/bis-lists.ts";

/** WotLK BiS (ICC / RS tier) — Titans guild (Death Knight / Frost). */
export const frostDeathKnightBis: BuiltInSpecBis = {
  className: ClassName.DeathKnight,
  spec: "Frost",
  presets: [
    {
      id: "titans",
      name: "Titans",
      slots: [
        { slot: 0, itemIds: [51312] },
        { slot: 1, itemIds: [54581] },
        { slot: 2, itemIds: [51314] },
        { slot: 3, itemIds: [50467] },
        { slot: 4, itemIds: [51310] },
        { slot: 5, itemIds: [50670] },
        { slot: 6, itemIds: [50675] },
        { slot: 7, itemIds: [50620] },
        { slot: 8, itemIds: [51313] },
        { slot: 9, itemIds: [54578] },
        { slot: 10, itemIds: [52572] },
        { slot: 11, itemIds: [50693] },
        { slot: 12, itemIds: [50363] },
        { slot: 13, itemIds: [54590] },
        { slot: 14, itemIds: [50737] },
      ],
    },
  ],
};
