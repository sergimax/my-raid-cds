import { ClassName } from "../../types/characters.ts";
import type { BuiltInSpecBis } from "../../types/bis-lists.ts";

/**
 * WotLK BiS presets for Assassination Rogue (community sources).
 * @see https://www.icy-veins.com/wotlk-classic/assassination-rogue-dps-pve-gear-best-in-slot
 * @see https://forum.warmane.com/showthread.php?t=360782
 */
export const assassinationRogueBis: BuiltInSpecBis = {
  className: ClassName.Rogue,
  spec: "Assassination",
  presets: [
    {
      id: "icy-veins-simonize-and-sellin-assassination",
      name: "Assassination (icy-veins · Simonize and Sellin)",
      slots: [
        { slot: 0, itemIds: [51252] },
        { slot: 1, itemIds: [50633] },
        { slot: 2, itemIds: [51254] },
        { slot: 3, itemIds: [50653] },
        { slot: 4, itemIds: [50656] },
        { slot: 5, itemIds: [54580] },
        { slot: 6, itemIds: [51251] },
        { slot: 7, itemIds: [50707] },
        { slot: 8, itemIds: [51253] },
        { slot: 9, itemIds: [50607] },
        { slot: 10, itemIds: [50402] },
        { slot: 11, itemIds: [54576] },
        { slot: 12, itemIds: [50363] },
        { slot: 13, itemIds: [54590] },
        { slot: 14, itemIds: [50621] },
        { slot: 15, itemIds: [50641] },
        { slot: 16, itemIds: [50733] },
      ],
    },
    {
      id: "warmane-fluffybully-the-sneaky-stabber",
      name: "The sneaky stabber (Warmane · Fluffybully)",
      slots: [
        { slot: 0, itemIds: [51252] },
        { slot: 1, itemIds: [50633] },
        { slot: 2, itemIds: [51254] },
        { slot: 3, itemIds: [50653] },
        { slot: 4, itemIds: [50656] },
        { slot: 5, itemIds: [54580] },
        { slot: 6, itemIds: [51251] },
        { slot: 7, itemIds: [50707] },
        { slot: 8, itemIds: [51253] },
        { slot: 9, itemIds: [50607] },
        { slot: 10, itemIds: [50402] },
        { slot: 11, itemIds: [54576] },
        { slot: 12, itemIds: [54590] },
        { slot: 13, itemIds: [50363] },
        { slot: 14, itemIds: [50736] },
        { slot: 15, itemIds: [50621] },
        { slot: 16, itemIds: [50733] },
      ],
    },
  ],
};
