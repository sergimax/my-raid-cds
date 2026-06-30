import { ClassName } from "../../types/characters.ts";
import type { BuiltInSpecBis } from "../../types/bis-lists.ts";

/**
 * WotLK BiS presets for Assassination Rogue.
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
        { slot: 0, itemIds: [51252] }, // Head: Sanctified Shadowblade Helmet
        { slot: 1, itemIds: [50633] }, // Neck: Sindragosa's Cruel Claw
        { slot: 2, itemIds: [51254] }, // Shoulder: Sanctified Shadowblade Pauldrons
        { slot: 3, itemIds: [50653] }, // Back: Shadowvault Slayer's Cloak
        { slot: 4, itemIds: [50656] }, // Chest: Ikfirus's Sack of Wonder
        { slot: 5, itemIds: [54580] }, // Wrist: Umbrage Armbands
        { slot: 6, itemIds: [51251] }, // Hands: Sanctified Shadowblade Gauntlets
        { slot: 7, itemIds: [50707] }, // Waist: Astrylian's Sutured Cinch
        { slot: 8, itemIds: [51253] }, // Legs: Sanctified Shadowblade Legplates
        { slot: 9, itemIds: [50607] }, // Feet: Frostbitten Fur Boots
        { slot: 10, itemIds: [50402] }, // Finger 1: Ashen Band of Endless Vengeance
        { slot: 11, itemIds: [54576] }, // Finger 2: Signet of Twilight
        { slot: 12, itemIds: [50363] }, // Trinket 1: Deathbringer's Will
        { slot: 13, itemIds: [54590] }, // Trinket 2: Sharpened Twilight Scale
        { slot: 14, itemIds: [50621] }, // Main hand: Lungbreaker
        { slot: 15, itemIds: [50641] }, // Off hand: Heartpierce
        { slot: 16, itemIds: [50733] }, // Ranged: Fal'inrush, Defender of Quel'thalas
      ],
    },
    {
      id: "warmane-fluffybully-the-sneaky-stabber",
      name: "The sneaky stabber (Warmane · Fluffybully)",
      slots: [
        { slot: 0, itemIds: [51252] }, // Head: Sanctified Shadowblade Helmet
        { slot: 1, itemIds: [50633] }, // Neck: Sindragosa's Cruel Claw
        { slot: 2, itemIds: [51254] }, // Shoulder: Sanctified Shadowblade Pauldrons
        { slot: 3, itemIds: [50653] }, // Back: Shadowvault Slayer's Cloak
        { slot: 4, itemIds: [50656] }, // Chest: Ikfirus's Sack of Wonder
        { slot: 5, itemIds: [54580] }, // Wrist: Umbrage Armbands
        { slot: 6, itemIds: [51251] }, // Hands: Sanctified Shadowblade Gauntlets
        { slot: 7, itemIds: [50707] }, // Waist: Astrylian's Sutured Cinch
        { slot: 8, itemIds: [51253] }, // Legs: Sanctified Shadowblade Legplates
        { slot: 9, itemIds: [50607] }, // Feet: Frostbitten Fur Boots
        { slot: 10, itemIds: [50402] }, // Finger 1: Ashen Band of Endless Vengeance
        { slot: 11, itemIds: [54576] }, // Finger 2: Signet of Twilight
        { slot: 12, itemIds: [54590] }, // Trinket 1: Sharpened Twilight Scale
        { slot: 13, itemIds: [50363] }, // Trinket 2: Deathbringer's Will
        { slot: 14, itemIds: [50736] }, // Main hand: Heaven's Fall, Kryss of a Thousand Lies
        { slot: 15, itemIds: [50621] }, // Off hand: Lungbreaker
        { slot: 16, itemIds: [50733] }, // Ranged: Fal'inrush, Defender of Quel'thalas
      ],
    },
  ],
};
