import { ClassName } from "../../types/characters.ts";
import type { BuiltInSpecBis } from "../../types/bis-lists.ts";

/**
 * WotLK BiS presets for Subtlety Rogue (community sources).
 * @see https://www.icy-veins.com/wotlk-classic/subtlety-rogue-dps-pve-gear-best-in-slot
 */
export const subtletyRogueBis: BuiltInSpecBis = {
  className: ClassName.Rogue,
  spec: "Subtlety",
  presets: [
    {
      id: "icy-veins-simonize-and-sellin-subtlety",
      name: "Subtlety (icy-veins · Simonize and Sellin)",
      slots: [
        { slot: 0, itemIds: [51252] },
        { slot: 1, itemIds: [50633] },
        { slot: 2, itemIds: [51254] },
        { slot: 3, itemIds: [47545] },
        { slot: 4, itemIds: [50656] },
        { slot: 5, itemIds: [50670] },
        { slot: 6, itemIds: [50675] },
        { slot: 7, itemIds: [50707] },
        { slot: 8, itemIds: [50697] },
        { slot: 9, itemIds: [50607] },
        { slot: 10, itemIds: [50402] },
        { slot: 11, itemIds: [54576] },
        { slot: 12, itemIds: [50363] },
        { slot: 13, itemIds: [54590] },
        { slot: 14, itemIds: [50737] },
        { slot: 15, itemIds: [50654] },
        { slot: 16, itemIds: [50733] },
      ],
    },
  ],
};
