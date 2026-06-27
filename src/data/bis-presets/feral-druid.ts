import { ClassName } from "../../types/characters.ts";
import type { BuiltInSpecBis } from "../../types/bis-lists.ts";

/**
 * WotLK BiS presets for Feral Druid (community sources).
 * @see https://forum.warmane.com/showthread.php?t=431156
 * @see https://forum.wowcircle.com/showthread.php?t=2727
 * @see https://www.icy-veins.com/wotlk-classic/feral-druid-dps-pve-gear-best-in-slot?area=phase_5
 */
export const feralDruidBis: BuiltInSpecBis = {
  className: ClassName.Druid,
  spec: "Feral",
  presets: [
    {
      id: "warmane-ayizan-feral-cat",
      name: "Feral Cat (Warmane · Ayizan)",
      slots: [
        { slot: 0, itemIds: [51296] },
        { slot: 1, itemIds: [50633] },
        { slot: 2, itemIds: [51299] },
        { slot: 3, itemIds: [50653] },
        { slot: 4, itemIds: [51298] },
        { slot: 5, itemIds: [50670, 54580] },
        { slot: 6, itemIds: [50675] },
        { slot: 7, itemIds: [50707] },
        { slot: 8, itemIds: [51297] },
        { slot: 9, itemIds: [50607] },
        { slot: 10, itemIds: [50618, 54576] },
        { slot: 11, itemIds: [50402] },
        { slot: 12, itemIds: [54590] },
        { slot: 13, itemIds: [50363] },
        { slot: 14, itemIds: [50735] },
        { slot: 16, itemIds: [50456] },
      ],
    },
    {
      id: "circle-decay-feral-dd",
      name: "Feral DD (Circle · Decay)",
      slots: [
        { slot: 0, itemIds: [51296] },
        { slot: 1, itemIds: [50633] },
        { slot: 2, itemIds: [51299] },
        { slot: 3, itemIds: [50653] },
        { slot: 4, itemIds: [51298] },
        { slot: 5, itemIds: [54580] },
        { slot: 6, itemIds: [50675] },
        { slot: 7, itemIds: [50707] },
        { slot: 8, itemIds: [51297] },
        { slot: 9, itemIds: [50607] },
        { slot: 10, itemIds: [50604] },
        { slot: 11, itemIds: [50402] },
        { slot: 12, itemIds: [54590] },
        { slot: 13, itemIds: [50363] },
        { slot: 14, itemIds: [50735] },
      ],
    },
    {
      id: "icy-veins-seksixeny-feral-dps",
      name: "Feral DPS (Icy-Veins · Seksixeny)",
      slots: [
        { slot: 0, itemIds: [51296] },
        { slot: 1, itemIds: [50633] },
        { slot: 2, itemIds: [51299] },
        { slot: 3, itemIds: [50653] },
        { slot: 4, itemIds: [51298] },
        { slot: 5, itemIds: [54580] },
        { slot: 6, itemIds: [50675] },
        { slot: 7, itemIds: [50707] },
        { slot: 8, itemIds: [51297] },
        { slot: 9, itemIds: [50607] },
        { slot: 10, itemIds: [54576] },
        { slot: 11, itemIds: [50604] },
        { slot: 12, itemIds: [50363] },
        { slot: 13, itemIds: [54590] },
        { slot: 14, itemIds: [50735] },
        { slot: 16, itemIds: [50456] },
      ],
    },
  ],
};
