import type { Dungeon } from "../types/dungeons.ts";
import { DungeonMode } from "../types/dungeons.ts";

/** WotLK raids: Russian (in-game) name + English (original) name. */
export const RaidNames = {
  naxxramas: { ru: "Наксрамас", en: "Naxxramas" },
  obsidianSanctum: { ru: "Обсидиановое святилище", en: "The Obsidian Sanctum" },
  onyxiasLair: { ru: "Логово Ониксии", en: "Onyxia's Lair" },
  vaultOfArchavon: { ru: "Склеп Аркавона", en: "Vault of Archavon" },
  trialOfTheCrusader: { ru: "Испытание крестоносца", en: "Trial of the Crusader" },
  ulduar: { ru: "Ульдуар", en: "Ulduar" },
  icecrownCitadel: { ru: "Цитадель Ледяной Короны", en: "Icecrown Citadel" },
  rubySanctum: { ru: "Рубиновое святилище", en: "The Ruby Sanctum" },
} as const;

/** Lookup for English display: stored `Dungeon.name` (RU) → EN. */
export const ruRaidNameToEn: Readonly<Record<string, string>> = Object.fromEntries(
  Object.values(RaidNames).map((pair) => [pair.ru, pair.en])
);

/** Russian name with original English in parentheses when known (template raids). */
export function formatRaidNameRuWithEn(ruName: string): string {
  const en = ruRaidNameToEn[ruName];
  return en ? `${ruName} (${en})` : ruName;
}

const R = RaidNames;

export const DungeonList: Array<Dungeon> = [
  { name: R.naxxramas.ru, size: 10, itemLevel: [200], mode: DungeonMode.NORMAL },
  { name: R.naxxramas.ru, size: 25, itemLevel: [213], mode: DungeonMode.NORMAL },
  {
    name: R.obsidianSanctum.ru,
    size: 10,
    itemLevel: [200, 213],
    mode: DungeonMode.NORMAL,
  },
  {
    name: R.obsidianSanctum.ru,
    size: 25,
    itemLevel: [213, 226],
    mode: DungeonMode.NORMAL,
  },
  {
    name: R.onyxiasLair.ru,
    size: 10,
    itemLevel: [232],
    mode: DungeonMode.NORMAL,
  },
  {
    name: R.onyxiasLair.ru,
    size: 25,
    itemLevel: [245],
    mode: DungeonMode.NORMAL,
  },
  {
    name: R.vaultOfArchavon.ru,
    size: 10,
    itemLevel: [232, 251],
    mode: DungeonMode.NORMAL,
  },
  {
    name: R.vaultOfArchavon.ru,
    size: 25,
    itemLevel: [245, 264],
    mode: DungeonMode.NORMAL,
  },
  {
    name: R.trialOfTheCrusader.ru,
    size: 10,
    itemLevel: [232],
    mode: DungeonMode.NORMAL,
  },
  {
    name: R.trialOfTheCrusader.ru,
    size: 10,
    itemLevel: [245],
    mode: DungeonMode.HEROIC,
  },
  {
    name: R.trialOfTheCrusader.ru,
    size: 25,
    itemLevel: [245],
    mode: DungeonMode.NORMAL,
  },
  {
    name: R.trialOfTheCrusader.ru,
    size: 25,
    itemLevel: [258],
    mode: DungeonMode.HEROIC,
  },
  {
    name: R.ulduar.ru,
    size: 10,
    itemLevel: [219, 232],
    mode: DungeonMode.NORMAL,
  },
  {
    name: R.ulduar.ru,
    size: 25,
    itemLevel: [226, 239],
    mode: DungeonMode.NORMAL,
  },
  {
    name: R.icecrownCitadel.ru,
    size: 10,
    itemLevel: [251, 258],
    mode: DungeonMode.NORMAL,
  },
  {
    name: R.icecrownCitadel.ru,
    size: 10,
    itemLevel: [264, 271],
    mode: DungeonMode.HEROIC,
  },
  {
    name: R.icecrownCitadel.ru,
    size: 25,
    itemLevel: [264, 271],
    mode: DungeonMode.NORMAL,
  },
  {
    name: R.icecrownCitadel.ru,
    size: 25,
    itemLevel: [277, 284],
    mode: DungeonMode.HEROIC,
  },
  {
    name: R.rubySanctum.ru,
    size: 10,
    itemLevel: [258],
    mode: DungeonMode.NORMAL,
  },
  {
    name: R.rubySanctum.ru,
    size: 10,
    itemLevel: [271],
    mode: DungeonMode.HEROIC,
  },
  {
    name: R.rubySanctum.ru,
    size: 25,
    itemLevel: [271],
    mode: DungeonMode.NORMAL,
  },
  {
    name: R.rubySanctum.ru,
    size: 25,
    itemLevel: [284],
    mode: DungeonMode.HEROIC,
  },
];
