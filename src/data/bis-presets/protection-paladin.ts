import { ClassName } from "../../types/characters.ts";
import type { BuiltInSpecBis } from "../../types/bis-lists.ts";

/** WotLK BiS (ICC / RS tier) — Titans guild (Paladin / Protection). */
export const protectionPaladinBis: BuiltInSpecBis = {
  className: ClassName.Paladin,
  spec: "Protection",
  presets: [
    {
      id: "titans",
      name: "Titans",
      slots: [
        { slot: 0, itemIds: [50640] },
        { slot: 1, itemIds: [50682] },
        { slot: 2, itemIds: [51269] },
        { slot: 3, itemIds: [50718] },
        { slot: 4, itemIds: [51265] },
        { slot: 5, itemIds: [50611] },
        { slot: 6, itemIds: [51267] },
        { slot: 7, itemIds: [50691] },
        { slot: 8, itemIds: [51268] },
        { slot: 9, itemIds: [54579] },
        { slot: 10, itemIds: [50404] },
        { slot: 11, itemIds: [50642] },
        { slot: 12, itemIds: [50364] },
        { slot: 13, itemIds: [50356] },
        { slot: 14, itemIds: [50737] },
        { slot: 15, itemIds: [50729] },
      ],
    },
  ],
};
