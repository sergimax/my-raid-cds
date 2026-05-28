import { EmblemKey } from "../assets/emblems/emblem-icons.ts";
import type { Dungeon } from "../types/dungeons.ts";
import { DungeonDifficulty } from "../types/dungeons.ts";

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

/** Lookup for English display: stored `Dungeon.name` (RU) → EN. */
export const ruRaidNameToEn: Readonly<Record<string, string>> = Object.fromEntries(
  Object.values(RaidNames).map((pair) => [pair.ru, pair.en])
);

/** Lookup for emblem on load when older saves omit `emblem`. */
export const ruRaidNameToEmblem: Readonly<Record<string, (typeof RaidNames)[keyof typeof RaidNames]["emblem"]>> =
  Object.fromEntries(Object.values(RaidNames).map((pair) => [pair.ru, pair.emblem]));

/** Russian name with original English in parentheses when known (template raids). */
export function formatRaidNameRuWithEn(ruName: string): string {
  const en = ruRaidNameToEn[ruName];
  return en ? `${ruName} (${en})` : ruName;
}

const R = RaidNames;

export const DungeonList: Array<Dungeon> = [
  {
    name: R.naxxramas.ru,
    size: 10,
    itemLevel: [200],
    difficulty: DungeonDifficulty.NORMAL,
    emblem: R.naxxramas.emblem,
  },
  {
    name: R.naxxramas.ru,
    size: 25,
    itemLevel: [213],
    difficulty: DungeonDifficulty.NORMAL,
    emblem: R.naxxramas.emblem,
  },
  {
    name: R.obsidianSanctum.ru,
    size: 10,
    itemLevel: [200, 213],
    difficulty: DungeonDifficulty.NORMAL,
    emblem: R.obsidianSanctum.emblem,
  },
  {
    name: R.obsidianSanctum.ru,
    size: 25,
    itemLevel: [213, 226],
    difficulty: DungeonDifficulty.NORMAL,
    emblem: R.obsidianSanctum.emblem,
  },
  {
    name: R.onyxiasLair.ru,
    size: 10,
    itemLevel: [232],
    difficulty: DungeonDifficulty.NORMAL,
    emblem: R.onyxiasLair.emblem,
  },
  {
    name: R.onyxiasLair.ru,
    size: 25,
    itemLevel: [245],
    difficulty: DungeonDifficulty.NORMAL,
    emblem: R.onyxiasLair.emblem,
  },
  {
    name: R.vaultOfArchavon.ru,
    size: 10,
    itemLevel: [232, 251],
    difficulty: DungeonDifficulty.NORMAL,
    emblem: R.vaultOfArchavon.emblem,
  },
  {
    name: R.vaultOfArchavon.ru,
    size: 25,
    itemLevel: [245, 264],
    difficulty: DungeonDifficulty.NORMAL,
    emblem: R.vaultOfArchavon.emblem,
  },
  {
    name: R.trialOfTheCrusader.ru,
    size: 10,
    itemLevel: [232],
    difficulty: DungeonDifficulty.NORMAL,
    emblem: R.trialOfTheCrusader.emblem,
  },
  {
    name: R.trialOfTheCrusader.ru,
    size: 10,
    itemLevel: [245],
    difficulty: DungeonDifficulty.HEROIC,
    emblem: R.trialOfTheCrusader.emblem,
  },
  {
    name: R.trialOfTheCrusader.ru,
    size: 25,
    itemLevel: [245],
    difficulty: DungeonDifficulty.NORMAL,
    emblem: R.trialOfTheCrusader.emblem,
  },
  {
    name: R.trialOfTheCrusader.ru,
    size: 25,
    itemLevel: [258],
    difficulty: DungeonDifficulty.HEROIC,
    emblem: R.trialOfTheCrusader.emblem,
  },
  {
    name: R.ulduar.ru,
    size: 10,
    itemLevel: [219, 232],
    difficulty: DungeonDifficulty.NORMAL,
    emblem: R.ulduar.emblem,
  },
  {
    name: R.ulduar.ru,
    size: 25,
    itemLevel: [226, 239],
    difficulty: DungeonDifficulty.NORMAL,
    emblem: R.ulduar.emblem,
  },
  {
    name: R.icecrownCitadel.ru,
    size: 10,
    itemLevel: [251, 258],
    difficulty: DungeonDifficulty.NORMAL,
    emblem: R.icecrownCitadel.emblem,
  },
  {
    name: R.icecrownCitadel.ru,
    size: 10,
    itemLevel: [264, 271],
    difficulty: DungeonDifficulty.HEROIC,
    emblem: R.icecrownCitadel.emblem,
  },
  {
    name: R.icecrownCitadel.ru,
    size: 25,
    itemLevel: [264, 271],
    difficulty: DungeonDifficulty.NORMAL,
    emblem: R.icecrownCitadel.emblem,
  },
  {
    name: R.icecrownCitadel.ru,
    size: 25,
    itemLevel: [277, 284],
    difficulty: DungeonDifficulty.HEROIC,
    emblem: R.icecrownCitadel.emblem,
  },
  {
    name: R.rubySanctum.ru,
    size: 10,
    itemLevel: [258],
    difficulty: DungeonDifficulty.NORMAL,
    emblem: R.rubySanctum.emblem,
  },
  {
    name: R.rubySanctum.ru,
    size: 10,
    itemLevel: [271],
    difficulty: DungeonDifficulty.HEROIC,
    emblem: R.rubySanctum.emblem,
  },
  {
    name: R.rubySanctum.ru,
    size: 25,
    itemLevel: [271],
    difficulty: DungeonDifficulty.NORMAL,
    emblem: R.rubySanctum.emblem,
  },
  {
    name: R.rubySanctum.ru,
    size: 25,
    itemLevel: [284],
    difficulty: DungeonDifficulty.HEROIC,
    emblem: R.rubySanctum.emblem,
  },
];
