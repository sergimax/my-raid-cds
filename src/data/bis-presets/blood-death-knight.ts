import { ClassName } from "../../types/characters.ts";
import type { BuiltInSpecBis } from "../../types/bis-lists.ts";

/** WotLK BiS (ICC / RS tier) for Blood Death Knight — Warmane guide. */
export const bloodDeathKnightBis: BuiltInSpecBis = {
  className: ClassName.DeathKnight,
  spec: "Blood",
  presets: [
    {
      id: "default",
      name: "Default",
      slots: [
        { slot: 0, itemIds: [51306] },
        { slot: 1, itemIds: [50682] },
        { slot: 2, itemIds: [51309] },
        { slot: 3, itemIds: [50718] },
        { slot: 4, itemIds: [51305] },
        { slot: 5, itemIds: [51901] },
        { slot: 6, itemIds: [51307] },
        { slot: 7, itemIds: [50991] },
        { slot: 8, itemIds: [50612] },
        { slot: 9, itemIds: [54579] },
        { slot: 10, itemIds: [50622] },
        { slot: 11, itemIds: [50404] },
        { slot: 12, itemIds: [54591] },
        { slot: 13, itemIds: [50364] },
        { slot: 14, itemIds: [50730] },
        { slot: 16, itemIds: [47672] },
      ],
    },
    {
      id: "titans",
      name: "Titans",
      slots: [
        { slot: 0, itemIds: [50640] },
        { slot: 1, itemIds: [50627] },
        { slot: 2, itemIds: [51309] },
        { slot: 3, itemIds: [50718] },
        { slot: 4, itemIds: [51305] },
        { slot: 5, itemIds: [50611] },
        { slot: 6, itemIds: [51307] },
        { slot: 7, itemIds: [50691] },
        { slot: 8, itemIds: [51308] },
        { slot: 9, itemIds: [54579] },
        { slot: 10, itemIds: [50404] },
        { slot: 11, itemIds: [50622] },
        { slot: 12, itemIds: [50364] },
        { slot: 14, itemIds: [50730] },
      ],
    },
  ],
};
