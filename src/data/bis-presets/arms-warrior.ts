import { ClassName } from "../../types/characters.ts";
import type { BuiltInSpecBis } from "../../types/bis-lists.ts";

/**
 * WotLK BiS presets for Arms Warrior.
 * @see https://www.icy-veins.com/wotlk-classic/arms-warrior-dps-pve-spec-builds-talents-glyphs
 */
export const armsWarriorBis: BuiltInSpecBis = {
  className: ClassName.Warrior,
  spec: "Arms",
  presets: [
    {
      id: "icy-veins-abide-arms",
      name: "Arms (icy-veins · Abide)",
      slots: [
        { slot: 0, itemIds: [51227] }, // Head: Sanctified Ymirjar Lord's Helmet
        { slot: 1, itemIds: [54581] }, // Neck: Penumbra Pendant
        { slot: 2, itemIds: [51229] }, // Shoulder: Sanctified Ymirjar Lord's Shoulderplates
        { slot: 3, itemIds: [47545] }, // Back: Vereesa's Dexterity
        { slot: 4, itemIds: [51225] }, // Chest: Sanctified Ymirjar Lord's Battleplate
        { slot: 5, itemIds: [54580] }, // Wrist: Umbrage Armbands
        { slot: 6, itemIds: [51226] }, // Hands: Sanctified Ymirjar Lord's Gauntlets
        { slot: 7, itemIds: [50620] }, // Waist: Coldwraith Links
        { slot: 8, itemIds: [50645] }, // Legs: Leggings of Northern Lights
        { slot: 9, itemIds: [54578] }, // Feet: Apocalypse's Advance
        { slot: 10, itemIds: [50402] }, // Finger 1: Ashen Band of Endless Vengeance
        { slot: 11, itemIds: [50618] }, // Finger 2: Frostbrood Sapphire Ring
        { slot: 12, itemIds: [50363] }, // Trinket 1: Deathbringer's Will
        { slot: 13, itemIds: [54590] }, // Trinket 2: Sharpened Twilight Scale
        { slot: 14, itemIds: [49623] }, // Main hand: Shadowmourne
        { slot: 16, itemIds: [50733] }, // Ranged: Fal'inrush, Defender of Quel'thalas
      ],
    },
  ],
};
