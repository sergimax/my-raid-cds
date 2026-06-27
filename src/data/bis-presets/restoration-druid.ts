import { ClassName } from "../../types/characters.ts";
import type { BuiltInSpecBis } from "../../types/bis-lists.ts";

/**
 * WotLK BiS presets for Restoration Druid (community sources).
 * @see https://forum.warmane.com/showthread.php?t=226506
 */
export const restorationDruidBis: BuiltInSpecBis = {
  className: ClassName.Druid,
  spec: "Restoration",
  presets: [
    {
      id: "warmane-funkymusic-resto-druid",
      name: "Resto Druid (Warmane · Funkymusic)",
      slots: [
        { slot: 0, itemIds: [51290] },
        { slot: 1, itemIds: [50609] },
        { slot: 2, itemIds: [51292] },
        { slot: 3, itemIds: [50668] },
        { slot: 4, itemIds: [50717] },
        { slot: 5, itemIds: [54582] },
        { slot: 6, itemIds: [51291] },
        { slot: 7, itemIds: [50705] },
        { slot: 8, itemIds: [51293] },
        { slot: 9, itemIds: [50665] },
        { slot: 10, itemIds: [50400] },
        { slot: 11, itemIds: [50636] },
        { slot: 12, itemIds: [54589] },
        { slot: 13, itemIds: [50366] },
        { slot: 14, itemIds: [46017] },
        { slot: 15, itemIds: [50635] },
        { slot: 16, itemIds: [50454] },
      ],
    },
  ],
};
