import { ClassName } from "../../types/characters.ts";
import type { BuiltInSpecBis } from "../../types/bis-lists.ts";

/** WotLK BiS (ICC / RS tier) — Titans guild (Druid / Feral). */
export const feralDruidBis: BuiltInSpecBis = {
  className: ClassName.Druid,
  spec: "Feral",
  presets: [
    {
      id: "titans",
      name: "Titans",
      slots: [
        { slot: 0, itemIds: [51296] }, // Head: Sanctified Lasherweave Headguard
        { slot: 1, itemIds: [50633] }, // Neck: Sindragosa's Cruel Claw
        { slot: 2, itemIds: [51299] }, // Shoulder: Sanctified Lasherweave Shoulderpads
        { slot: 3, itemIds: [47546] }, // Back: Sylvanas' Cunning
        { slot: 4, itemIds: [51300] }, // Chest: Sanctified Lasherweave Robes
        { slot: 5, itemIds: [54580] }, // Wrist: Umbrage Armbands
        { slot: 6, itemIds: [50675] }, // Hands: Aldriana's Gloves of Secrecy
        { slot: 7, itemIds: [50707] }, // Waist: Astrylian's Sutured Cinch
        { slot: 8, itemIds: [51297] }, // Legs: Sanctified Lasherweave Legguards
        { slot: 9, itemIds: [50607] }, // Feet: Frostbitten Fur Boots
        { slot: 10, itemIds: [50402] }, // Finger 1: Ashen Band of Endless Vengeance
        { slot: 11, itemIds: [54576] }, // Finger 2: Signet of Twilight
        { slot: 12, itemIds: [50363] }, // Trinket 1: Deathbringer's Will
        { slot: 13, itemIds: [54590] }, // Trinket 2: Sharpened Twilight Scale
        { slot: 14, itemIds: [50735] }, // Main hand: Oathbinder, Charge of the Ranger-General
      ],
    },
  ],
};
