import { ClassName } from "../../types/characters.ts";
import type { BuiltInSpecBis } from "../../types/bis-lists.ts";

/**
 * WotLK BiS presets for Enhancement Shaman (community sources).
 * @see https://forum.warmane.com/showthread.php?t=311020
 * @see https://forum.wowcircle.com/showthread.php?t=419089
 * @see https://www.icy-veins.com/wotlk-classic/enhancement-shaman-dps-pve-gear-best-in-slot
 */
export const enhancementShamanBis: BuiltInSpecBis = {
  className: ClassName.Shaman,
  spec: "Enhancement",
  presets: [
    {
      id: "warmane-jakkre-enh-ap",
      name: "Enh-AP (Warmane · Jakkre)",
      slots: [
        { slot: 0, itemIds: [51242] },
        { slot: 1, itemIds: [51890] },
        { slot: 2, itemIds: [51240] },
        { slot: 3, itemIds: [50653] },
        { slot: 4, itemIds: [51244] },
        { slot: 5, itemIds: [54580] },
        { slot: 6, itemIds: [50619] },
        { slot: 7, itemIds: [50688] },
        { slot: 8, itemIds: [51241] },
        { slot: 9, itemIds: [54577] },
        { slot: 10, itemIds: [50402] },
        { slot: 11, itemIds: [50604] },
        { slot: 12, itemIds: [50355] },
        { slot: 13, itemIds: [54590] },
        { slot: 14, itemIds: [50737] },
        { slot: 15, itemIds: [50737] },
        { slot: 16, itemIds: [50458] },
      ],
    },
    {
      id: "circle-meteor-enh-ap",
      name: "Enh-AP (Circle · Meteor)",
      slots: [
        { slot: 14, itemIds: [50737] },
        { slot: 15, itemIds: [50737] },
      ],
    },
    {
      id: "icy-veins-seksixeny-enh-sp",
      name: "Enh-SP (Icy-Veins · Seksixeny)",
      slots: [
        { slot: 0, itemIds: [51242] },
        { slot: 1, itemIds: [50633] },
        { slot: 2, itemIds: [51240] },
        { slot: 3, itemIds: [54583] },
        { slot: 4, itemIds: [51244] },
        { slot: 5, itemIds: [54580] },
        { slot: 6, itemIds: [50619] },
        { slot: 7, itemIds: [54587] },
        { slot: 8, itemIds: [51241] },
        { slot: 9, itemIds: [50711] },
        { slot: 10, itemIds: [50604] },
        { slot: 11, itemIds: [50402] },
        { slot: 12, itemIds: [50365] },
        { slot: 13, itemIds: [54588] },
        { slot: 14, itemIds: [50734] },
        { slot: 15, itemIds: [50737] },
        { slot: 16, itemIds: [50458] },
      ],
    },
  ],
};
