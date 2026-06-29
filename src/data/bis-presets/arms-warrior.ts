import { ClassName } from "../../types/characters.ts";
import type { BuiltInSpecBis } from "../../types/bis-lists.ts";

/**
 * WotLK BiS presets for Arms Warrior (community sources).
 * @see https://www.icy-veins.com/wotlk-classic/arms-warrior-dps-pve-spec-builds-talents-glyphs
 */
export const armsWarriorBis: BuiltInSpecBis = {
  className: ClassName.Warrior,
  spec: "Arms",
  presets: [
    {
      id: "icy-veins-abide-arms",
      name: "Arms (icy-veins · Abide)",
      slots: [
        { slot: 0, itemIds: [51227] },
        { slot: 1, itemIds: [54581] },
        { slot: 2, itemIds: [51229] },
        { slot: 3, itemIds: [47545] },
        { slot: 4, itemIds: [51225] },
        { slot: 5, itemIds: [54580] },
        { slot: 6, itemIds: [51226] },
        { slot: 7, itemIds: [50620] },
        { slot: 8, itemIds: [50645] },
        { slot: 9, itemIds: [54578] },
        { slot: 10, itemIds: [50402] },
        { slot: 11, itemIds: [50618] },
        { slot: 12, itemIds: [50363] },
        { slot: 13, itemIds: [54590] },
        { slot: 14, itemIds: [49623] },
        { slot: 16, itemIds: [50733] },
      ],
    },
  ],
};
