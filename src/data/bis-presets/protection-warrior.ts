import { ClassName } from "../../types/characters.ts";
import type { BuiltInSpecBis } from "../../types/bis-lists.ts";

/**
 * WotLK BiS presets for Protection Warrior (community sources).
 * @see https://www.icy-veins.com/wotlk-classic/protection-warrior-tank-pve-guide
 */
export const protectionWarriorBis: BuiltInSpecBis = {
  className: ClassName.Warrior,
  spec: "Protection",
  presets: [
    {
      id: "icy-veins-abide-protection",
      name: "Protection (icy-veins · Abide)",
      slots: [
        { slot: 0, itemIds: [50640] },
        { slot: 1, itemIds: [50682] },
        { slot: 2, itemIds: [51224] },
        { slot: 3, itemIds: [50718] },
        { slot: 4, itemIds: [51220] },
        { slot: 5, itemIds: [50611] },
        { slot: 6, itemIds: [51222] },
        { slot: 7, itemIds: [50691] },
        { slot: 8, itemIds: [51223] },
        { slot: 9, itemIds: [54579] },
        { slot: 10, itemIds: [50404] },
        { slot: 11, itemIds: [50622] },
        { slot: 12, itemIds: [50364] },
        { slot: 13, itemIds: [54591] },
        { slot: 14, itemIds: [50738] },
        { slot: 15, itemIds: [50729] },
        { slot: 16, itemIds: [51834] },
      ],
    },
  ],
};
