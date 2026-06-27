import { ClassName } from "../../types/characters.ts";
import type { BuiltInSpecBis } from "../../types/bis-lists.ts";

/** WotLK BiS (ICC / RS tier) — Titans guild (Warrior / Fury). */
export const furyWarriorBis: BuiltInSpecBis = {
  className: ClassName.Warrior,
  spec: "Fury",
  presets: [
    {
      id: "titans",
      name: "Titans",
      slots: [
        { slot: 0, itemIds: [51227] },
        { slot: 1, itemIds: [54581] },
        { slot: 2, itemIds: [51229] },
        { slot: 3, itemIds: [50653] },
        { slot: 4, itemIds: [51225] },
        { slot: 5, itemIds: [54580] },
        { slot: 6, itemIds: [50675] },
        { slot: 7, itemIds: [50620] },
        { slot: 8, itemIds: [51228] },
        { slot: 9, itemIds: [54578] },
        { slot: 10, itemIds: [50402] },
        { slot: 11, itemIds: [50618] },
        { slot: 12, itemIds: [50363] },
        { slot: 13, itemIds: [54590] },
        { slot: 14, itemIds: [49623] },
        { slot: 15, itemIds: [50730] },
      ],
    },
  ],
};
