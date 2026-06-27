import { ClassName } from "../../types/characters.ts";
import type { BuiltInSpecBis } from "../../types/bis-lists.ts";

/** WotLK BiS (ICC / RS tier) — Titans guild (Paladin / Retribution). */
export const retributionPaladinBis: BuiltInSpecBis = {
  className: ClassName.Paladin,
  spec: "Retribution",
  presets: [
    {
      id: "titans",
      name: "Titans",
      slots: [
        { slot: 0, itemIds: [51277] },
        { slot: 1, itemIds: [54581] },
        { slot: 2, itemIds: [51279] },
        { slot: 3, itemIds: [50653] },
        { slot: 4, itemIds: [51275] },
        { slot: 5, itemIds: [54580] },
        { slot: 6, itemIds: [50690] },
        { slot: 7, itemIds: [50707] },
        { slot: 8, itemIds: [51278] },
        { slot: 9, itemIds: [54578] },
        { slot: 10, itemIds: [50402] },
        { slot: 11, itemIds: [54576] },
        { slot: 12, itemIds: [50706] },
        { slot: 13, itemIds: [54590] },
        { slot: 14, itemIds: [49623] },
      ],
    },
  ],
};
