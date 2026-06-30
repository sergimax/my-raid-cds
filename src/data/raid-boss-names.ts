/** WowSims drop boss / encounter labels → in-game Russian names. */
export type RaidBossNameEntry = {
  en: string;
  ru: string;
};

/**
 * Keys match `b` values in `wotlk-item-drop-sources.json` (WowSims `otherName` / `category`).
 */
export const RaidBossNames: Record<string, RaidBossNameEntry> = {
  "Archavon the Stone Watcher": {
    en: "Archavon the Stone Watcher",
    ru: "Аркавон Страж Камня",
  },
  "Anub'arak": { en: "Anub'arak", ru: "Ануб'арак" },
  "Argent Crusade Tribute Chest": {
    en: "Argent Crusade Tribute Chest",
    ru: "Сундук дани Серебряного авангарда",
  },
  "Blood Prince Council": { en: "Blood Prince Council", ru: "Кровавый совет" },
  "Blood-Queen Lana'thel": {
    en: "Blood-Queen Lana'thel",
    ru: "Кровавая королева Лан'тель",
  },
  "Class Item drops": { en: "Class Item drops", ru: "Классовые предметы" },
  "Emalon the Storm Watcher": {
    en: "Emalon the Storm Watcher",
    ru: "Эмалон Страж Бури",
  },
  "Deathbringer Saurfang": {
    en: "Deathbringer Saurfang",
    ru: "Саурфанг Смертоносный",
  },
  "Faction Champions": { en: "Faction Champions", ru: "Чемпионы фракций" },
  Festergut: { en: "Festergut", ru: "Тухлопуз" },
  Halion: { en: "Halion", ru: "Халион" },
  "Hard Mode": { en: "Hard Mode", ru: "Сложный режим" },
  "Koralon the Flame Watcher": {
    en: "Koralon the Flame Watcher",
    ru: "Коралон Страж Пламени",
  },
  "Icecrown Gunship Battle": {
    en: "Icecrown Gunship Battle",
    ru: "Бой на кораблях",
  },
  "Lady Deathwhisper": { en: "Lady Deathwhisper", ru: "Леди Смертный Шепот" },
  "Lord Jaraxxus": { en: "Lord Jaraxxus", ru: "Лорд Джараксус" },
  "Lord Marrowgar": { en: "Lord Marrowgar", ru: "Лорд Ребрад" },
  "One Drake Left": { en: "One Drake Left", ru: "С одним драконом" },
  "Professor Putricide": { en: "Professor Putricide", ru: "Профессор Мерзоцид" },
  Rotface: { en: "Rotface", ru: "Гниломорд" },
  Sindragosa: { en: "Sindragosa", ru: "Синдрагоса" },
  "Toravon the Ice Watcher": {
    en: "Toravon the Ice Watcher",
    ru: "Торавон Страж Льда",
  },
  "The Beasts of Northrend": {
    en: "The Beasts of Northrend",
    ru: "Звери Нордскола",
  },
  "The Lich King": { en: "The Lich King", ru: "Король-лич" },
  "The Twin Val'kyr": { en: "The Twin Val'kyr", ru: "Близнецы валь'киры" },
  Trash: { en: "Trash", ru: "Трэш" },
  "Trash Mobs": { en: "Trash Mobs", ru: "Трэш мобы" },
  "Two Drakes Left": { en: "Two Drakes Left", ru: "С двумя драконами" },
  "Valithria Dreamwalker": {
    en: "Valithria Dreamwalker",
    ru: "Валитрия Сноходица",
  },
};
