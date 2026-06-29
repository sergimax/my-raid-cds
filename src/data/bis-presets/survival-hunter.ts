import { ClassName } from "../../types/characters.ts";
import type { BuiltInSpecBis } from "../../types/bis-lists.ts";

/**
 * WotLK BiS presets for Survival Hunter (community sources).
 * @see https://www.icy-veins.com/wotlk-classic/survival-hunter-dps-pve-guide
 */
export const survivalHunterBis: BuiltInSpecBis = {
  className: ClassName.Hunter,
  spec: "Survival",
  presets: [
    {
      id: "icy-veins-impakt-survival",
      name: "Survival (icy-veins · Impakt)",
      slots: [
        { slot: 0, itemIds: [51286] },
        { slot: 1, itemIds: [50633] },
        { slot: 2, itemIds: [51288] },
        { slot: 3, itemIds: [47546] },
        { slot: 4, itemIds: [51289] },
        { slot: 5, itemIds: [50655] },
        { slot: 6, itemIds: [51285] },
        { slot: 7, itemIds: [50688] },
        { slot: 8, itemIds: [50645] },
        { slot: 9, itemIds: [54577] },
        { slot: 10, itemIds: [50618] },
        { slot: 11, itemIds: [54576] },
        { slot: 12, itemIds: [50363] },
        { slot: 13, itemIds: [54590] },
        { slot: 14, itemIds: [50735] },
        { slot: 16, itemIds: [50733] },
      ],
    },
  ],
};
