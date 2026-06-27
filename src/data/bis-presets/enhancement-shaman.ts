import { ClassName } from "../../types/characters.ts";
import type { BuiltInSpecBis } from "../../types/bis-lists.ts";

/** WotLK BiS (ICC / RS tier) — Titans guild (Shaman / Enhancement). */
export const enhancementShamanBis: BuiltInSpecBis = {
  className: ClassName.Shaman,
  spec: "Enhancement",
  presets: [
    {
      id: "titans",
      name: "Titans",
      slots: [
        { slot: 0, itemIds: [51247] }, // Head: Sanctified Frost Witch's Headpiece
        { slot: 1, itemIds: [51890] }, // Neck: Precious's Putrid Collar
        { slot: 2, itemIds: [51245] }, // Shoulder: Sanctified Frost Witch's Spaulders
        { slot: 3, itemIds: [50653] }, // Back: Shadowvault Slayer's Cloak
        { slot: 4, itemIds: [51249] }, // Chest: Sanctified Frost Witch's Tunic
        { slot: 5, itemIds: [54580] }, // Wrist: Umbrage Armbands
        { slot: 6, itemIds: [50619] }, // Hands: Anub'ar Stalker's Gloves
        { slot: 7, itemIds: [50688] }, // Waist: Nerub'ar Stalker's Cord
        { slot: 8, itemIds: [51246] }, // Legs: Sanctified Frost Witch's Legguards
        { slot: 9, itemIds: [54577] }, // Feet: Returning Footfalls
        { slot: 10, itemIds: [54576] }, // Finger 1: Signet of Twilight
        { slot: 11, itemIds: [50604] }, // Finger 2: Band of the Bone Colossus
        { slot: 12, itemIds: [54590] }, // Trinket 1: Sharpened Twilight Scale
        { slot: 13, itemIds: [50363] }, // Trinket 2: Deathbringer's Will
        { slot: 14, itemIds: [50737] }, // Main hand: Havoc's Call, Blade of Lordaeron Kings
        { slot: 15, itemIds: [50737] }, // Off hand: Havoc's Call, Blade of Lordaeron Kings
      ],
    },
  ],
};
