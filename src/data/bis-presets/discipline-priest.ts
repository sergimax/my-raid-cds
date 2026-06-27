import { ClassName } from "../../types/characters.ts";
import type { BuiltInSpecBis } from "../../types/bis-lists.ts";

/** WotLK BiS (ICC / RS tier) — Titans guild (Priest / Discipline). */
export const disciplinePriestBis: BuiltInSpecBis = {
  className: ClassName.Priest,
  spec: "Discipline",
  presets: [
    {
      id: "titans",
      name: "Titans",
      slots: [
        { slot: 0, itemIds: [51261] },
        { slot: 1, itemIds: [50724] },
        { slot: 2, itemIds: [51264] },
        { slot: 3, itemIds: [54583] },
        { slot: 4, itemIds: [50717] },
        { slot: 5, itemIds: [54582] },
        { slot: 6, itemIds: [51260] },
        { slot: 7, itemIds: [50702] },
        { slot: 8, itemIds: [51262] },
        { slot: 9, itemIds: [50699] },
        { slot: 10, itemIds: [50664] },
        { slot: 11, itemIds: [54585] },
        { slot: 12, itemIds: [54589] },
        { slot: 13, itemIds: [47432] },
        { slot: 14, itemIds: [50734] },
        { slot: 15, itemIds: [50719] },
        { slot: 16, itemIds: [50684] },
      ],
    },
  ],
};
