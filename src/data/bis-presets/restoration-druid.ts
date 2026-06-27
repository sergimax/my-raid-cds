import { ClassName } from "../../types/characters.ts";
import type { BuiltInSpecBis } from "../../types/bis-lists.ts";

/** WotLK BiS (ICC / RS tier) — Titans guild (Druid / Restoration). */
export const restorationDruidBis: BuiltInSpecBis = {
  className: ClassName.Druid,
  spec: "Restoration",
  presets: [
    {
      id: "titans",
      name: "Titans",
      slots: [
        { slot: 0, itemIds: [51296] },
        { slot: 1, itemIds: [50609] },
        { slot: 2, itemIds: [51299] },
        { slot: 3, itemIds: [54583] },
        { slot: 4, itemIds: [50717] },
        { slot: 5, itemIds: [54582] },
        { slot: 6, itemIds: [51291] },
        { slot: 7, itemIds: [50705] },
        { slot: 8, itemIds: [51297] },
        { slot: 9, itemIds: [50699] },
        { slot: 10, itemIds: [50400] },
        { slot: 11, itemIds: [54585] },
        { slot: 12, itemIds: [54589] },
        { slot: 13, itemIds: [50366] },
        { slot: 14, itemIds: [50734] },
        { slot: 15, itemIds: [50635] },
      ],
    },
  ],
};
