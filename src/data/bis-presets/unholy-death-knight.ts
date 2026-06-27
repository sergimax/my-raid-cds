import { ClassName } from "../../types/characters.ts";
import type { BuiltInSpecBis } from "../../types/bis-lists.ts";

/**
 * WotLK BiS presets for Unholy Death Knight (community sources).
 * @see https://forum.warmane.com/showthread.php?t=326654
 */
export const unholyDeathKnightBis: BuiltInSpecBis = {
  className: ClassName.DeathKnight,
  spec: "Unholy",
  presets: [
    {
      id: "warmane-drakantas-udk-str",
      name: "Udk-STR (Warmane · Drakantas)",
      slots: [
        { slot: 0, itemIds: [51312] },
        { slot: 1, itemIds: [54581] },
        { slot: 2, itemIds: [51314] },
        { slot: 3, itemIds: [50677] },
        { slot: 4, itemIds: [51310] },
        { slot: 5, itemIds: [54580] },
        { slot: 6, itemIds: [51311] },
        { slot: 7, itemIds: [50620] },
        { slot: 8, itemIds: [50624] },
        { slot: 9, itemIds: [54578] },
        { slot: 10, itemIds: [50693] },
        { slot: 11, itemIds: [52572] },
        { slot: 12, itemIds: [54590] },
        { slot: 13, itemIds: [50363] },
        { slot: 14, itemIds: [49623] },
      ],
    },
  ],
};
