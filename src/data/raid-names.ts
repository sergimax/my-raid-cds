import { EmblemKey } from "../assets/emblems/emblem-icons.ts";

/** WotLK raids: Russian (in-game) name + English (original) name + primary emblem. */
export const RaidNames = {
  naxxramas: { ru: "Наксрамас", en: "Naxxramas", emblem: EmblemKey.TRIUMPH },
  obsidianSanctum: {
    ru: "Обсидиановое святилище",
    en: "The Obsidian Sanctum",
    emblem: EmblemKey.TRIUMPH,
  },
  onyxiasLair: { ru: "Логово Ониксии", en: "Onyxia's Lair", emblem: EmblemKey.TRIUMPH },
  vaultOfArchavon: { ru: "Склеп Аркавона", en: "Vault of Archavon", emblem: EmblemKey.TRIUMPH },
  trialOfTheCrusader: {
    ru: "Испытание крестоносца",
    en: "Trial of the Crusader",
    emblem: EmblemKey.TRIUMPH,
  },
  ulduar: { ru: "Ульдуар", en: "Ulduar", emblem: EmblemKey.TRIUMPH },
  icecrownCitadel: {
    ru: "Цитадель Ледяной Короны",
    en: "Icecrown Citadel",
    emblem: EmblemKey.FROST,
  },
  rubySanctum: { ru: "Рубиновое святилище", en: "The Ruby Sanctum", emblem: EmblemKey.FROST },
} as const;

export type RaidKey = keyof typeof RaidNames;
