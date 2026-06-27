import { ClassName } from "../../types/characters.ts";
import type { BuiltInSpecBis } from "../../types/bis-lists.ts";

/** WotLK BiS (ICC / RS tier) — Titans guild (Druid / Restoration). */
export const restorationDruidBis: BuiltInSpecBis = {
  className: ClassName.Druid,
  spec: "Restoration",
  presets: [
    {
      id: "titans",
      name: "Titans",
      slots: [
        { slot: 0, itemIds: [51296] }, // Head: Sanctified Lasherweave Headguard
        { slot: 1, itemIds: [50609] }, // Neck: Bone Sentinel's Amulet
        { slot: 2, itemIds: [51299] }, // Shoulder: Sanctified Lasherweave Shoulderpads
        { slot: 3, itemIds: [54583] }, // Back: Cloak of Burning Dusk
        { slot: 4, itemIds: [50717] }, // Chest: Sanguine Silk Robes
        { slot: 5, itemIds: [54582] }, // Wrist: Bracers of Fiery Night
        { slot: 6, itemIds: [51291] }, // Hands: Sanctified Lasherweave Gloves
        { slot: 7, itemIds: [50705] }, // Waist: Professor's Bloodied Smock
        { slot: 8, itemIds: [51297] }, // Legs: Sanctified Lasherweave Legguards
        { slot: 9, itemIds: [50699] }, // Feet: Plague Scientist's Boots
        { slot: 10, itemIds: [50400] }, // Finger 1: Ashen Band of Endless Wisdom
        { slot: 11, itemIds: [54585] }, // Finger 2: Ring of Phased Regeneration
        { slot: 12, itemIds: [54589] }, // Trinket 1: Glowing Twilight Scale
        { slot: 13, itemIds: [50366] }, // Trinket 2: Althor's Abacus
        { slot: 14, itemIds: [50734] }, // Main hand: Royal Scepter of Terenas II
        { slot: 15, itemIds: [50635] }, // Off hand: Sundial of Eternal Dusk
      ],
    },
  ],
};
