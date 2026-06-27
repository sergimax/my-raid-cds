import { ClassName } from "../../types/characters.ts";
import type { BuiltInSpecBis } from "../../types/bis-lists.ts";

/** WotLK BiS (ICC / RS tier) — Titans guild (Shaman / Enhancement). */
export const enhancementShamanBis: BuiltInSpecBis = {
  className: ClassName.Shaman,
  spec: "Enhancement",
  presets: [
    {
      id: "titans",
      name: "Titans",
      slots: [
        { slot: 0, itemIds: [51247] },
        { slot: 1, itemIds: [51890] },
        { slot: 2, itemIds: [51245] },
        { slot: 3, itemIds: [50653] },
        { slot: 4, itemIds: [51249] },
        { slot: 5, itemIds: [54580] },
        { slot: 6, itemIds: [50619] },
        { slot: 7, itemIds: [50688] },
        { slot: 8, itemIds: [51246] },
        { slot: 9, itemIds: [54577] },
        { slot: 10, itemIds: [54576] },
        { slot: 11, itemIds: [50604] },
        { slot: 12, itemIds: [54590] },
        { slot: 13, itemIds: [50363] },
        { slot: 14, itemIds: [50737] },
        { slot: 15, itemIds: [50737] },
      ],
    },
  ],
};
