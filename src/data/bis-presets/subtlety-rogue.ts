import { ClassName } from "../../types/characters.ts";
import type { BuiltInSpecBis } from "../../types/bis-lists.ts";

/**
 * WotLK BiS presets for Subtlety Rogue.
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
        { slot: 0, itemIds: [51252] }, // Head: Sanctified Shadowblade Helmet
        { slot: 1, itemIds: [50633] }, // Neck: Sindragosa's Cruel Claw
        { slot: 2, itemIds: [51254] }, // Shoulder: Sanctified Shadowblade Pauldrons
        { slot: 3, itemIds: [47545] }, // Back: Vereesa's Dexterity
        { slot: 4, itemIds: [50656] }, // Chest: Ikfirus's Sack of Wonder
        { slot: 5, itemIds: [50670] }, // Wrist: Toskk's Maximized Wristguards
        { slot: 6, itemIds: [50675] }, // Hands: Aldriana's Gloves of Secrecy
        { slot: 7, itemIds: [50707] }, // Waist: Astrylian's Sutured Cinch
        { slot: 8, itemIds: [50697] }, // Legs: Gangrenous Leggings
        { slot: 9, itemIds: [50607] }, // Feet: Frostbitten Fur Boots
        { slot: 10, itemIds: [50402] }, // Finger 1: Ashen Band of Endless Vengeance
        { slot: 11, itemIds: [54576] }, // Finger 2: Signet of Twilight
        { slot: 12, itemIds: [50363] }, // Trinket 1: Deathbringer's Will
        { slot: 13, itemIds: [54590] }, // Trinket 2: Sharpened Twilight Scale
        { slot: 14, itemIds: [50737] }, // Main hand: Havoc's Call, Blade of Lordaeron Kings
        { slot: 15, itemIds: [50654] }, // Off hand: Scourgeborne Waraxe
        { slot: 16, itemIds: [50733] }, // Ranged: Fal'inrush, Defender of Quel'thalas
      ],
    },
  ],
};
