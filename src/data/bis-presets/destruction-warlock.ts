import { ClassName } from "../../types/characters.ts";
import type { BuiltInSpecBis } from "../../types/bis-lists.ts";

/**
 * WotLK BiS presets for Destruction Warlock.
 * @see https://www.icy-veins.com/wotlk-classic/destruction-warlock-dps-pve-gear-best-in-slot
 */
export const destructionWarlockBis: BuiltInSpecBis = {
  className: ClassName.Warlock,
  spec: "Destruction",
  presets: [
    {
      id: "icy-veins-abide-destruction",
      name: "Destruction (icy-veins · Abide)",
      slots: [
        { slot: 0, itemIds: [51231] }, // Head: Sanctified Dark Coven Hood
        { slot: 1, itemIds: [50658] }, // Neck: Amulet of the Silent Eulogy
        { slot: 2, itemIds: [51234] }, // Shoulder: Sanctified Dark Coven Shoulderpads
        { slot: 3, itemIds: [50628] }, // Back: Frostbinder's Shredded Cape
        { slot: 4, itemIds: [51233] }, // Chest: Sanctified Dark Coven Robe
        { slot: 5, itemIds: [50651] }, // Wrist: The Lady's Brittle Bracers
        { slot: 6, itemIds: [51230] }, // Hands: Sanctified Dark Coven Gloves
        { slot: 7, itemIds: [50613] }, // Waist: Crushing Coldwraith Belt
        { slot: 8, itemIds: [50694] }, // Legs: Plaguebringer's Stained Pants
        { slot: 9, itemIds: [50699] }, // Feet: Plague Scientist's Boots
        { slot: 10, itemIds: [50398] }, // Finger 1: Ashen Band of Endless Destruction
        { slot: 11, itemIds: [50664] }, // Finger 2: Ring of Rapid Ascent
        { slot: 12, itemIds: [50365] }, // Trinket 1: Phylactery of the Nameless Lich
        { slot: 13, itemIds: [50348] }, // Trinket 2: Dislodged Foreign Object
        { slot: 14, itemIds: [50732] }, // Main hand: Bloodsurge, Kel'Thuzad's Blade of Agony
        { slot: 15, itemIds: [50719] }, // Off hand: Shadow Silk Spindle
        { slot: 16, itemIds: [50684] }, // Ranged: Corpse-Impaling Spike
      ],
    },
  ],
};
