import { ClassName } from "../../types/characters.ts";
import type { BuiltInSpecBis } from "../../types/bis-lists.ts";

/** WotLK BiS (ICC / RS tier) — Titans guild (Rogue / Combat). */
export const combatRogueBis: BuiltInSpecBis = {
  className: ClassName.Rogue,
  spec: "Combat",
  presets: [
    {
      id: "titans",
      name: "Titans",
      slots: [
        { slot: 0, itemIds: [51252] },
        { slot: 1, itemIds: [50633] },
        { slot: 2, itemIds: [51254] },
        { slot: 3, itemIds: [47546] },
        { slot: 4, itemIds: [51250] },
        { slot: 5, itemIds: [54580] },
        { slot: 6, itemIds: [50675] },
        { slot: 7, itemIds: [50707] },
        { slot: 8, itemIds: [51253] },
        { slot: 9, itemIds: [50607] },
        { slot: 10, itemIds: [50402] },
        { slot: 11, itemIds: [54576] },
        { slot: 12, itemIds: [50363] },
        { slot: 13, itemIds: [54590] },
        { slot: 14, itemIds: [50737] },
        { slot: 15, itemIds: [50654] },
      ],
    },
  ],
};
