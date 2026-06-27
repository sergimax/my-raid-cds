import { ClassName } from "../../types/characters.ts";
import type { BuiltInSpecBis } from "../../types/bis-lists.ts";

/** WotLK BiS (ICC / RS tier) — Titans guild (Shaman / Elemental). */
export const elementalShamanBis: BuiltInSpecBis = {
  className: ClassName.Shaman,
  spec: "Elemental",
  presets: [
    {
      id: "titans",
      name: "Titans",
      slots: [
        { slot: 0, itemIds: [51247] },
        { slot: 1, itemIds: [50724] },
        { slot: 2, itemIds: [50698] },
        { slot: 3, itemIds: [54583] },
        { slot: 4, itemIds: [51249] },
        { slot: 5, itemIds: [54584] },
        { slot: 6, itemIds: [51248] },
        { slot: 7, itemIds: [54587] },
        { slot: 8, itemIds: [51246] },
        { slot: 9, itemIds: [50699] },
        { slot: 10, itemIds: [50398] },
        { slot: 11, itemIds: [50614] },
        { slot: 12, itemIds: [54588] },
        { slot: 13, itemIds: [50365] },
        { slot: 14, itemIds: [50734] },
        { slot: 15, itemIds: [50672] },
      ],
    },
  ],
};
