import { classIcons } from "../assets/class-icons/class-icons";

export const ClassName = {
  DeathKnight: "Death Knight",
  Druid: "Druid",
  Hunter: "Hunter",
  Mage: "Mage",
  Paladin: "Paladin",
  Priest: "Priest",
  Rogue: "Rogue",
  Shaman: "Shaman",
  Warlock: "Warlock",
  Warrior: "Warrior",
} as const;

export type ClassName = (typeof ClassName)[keyof typeof ClassName];

export type CharacterClass = {
  name: ClassName;
  color: string;
  icon: string;
};

export const Classes: Array<CharacterClass> = [
  { name: ClassName.DeathKnight, icon: classIcons["Death Knight"], color: "C41E3A" },
  { name: ClassName.Druid, icon: classIcons.Druid, color: "FF7C0A" },
  { name: ClassName.Hunter, icon: classIcons.Hunter, color: "AAD372" },
  { name: ClassName.Mage, icon: classIcons.Mage, color: "3FC7EB" },
  { name: ClassName.Paladin, icon: classIcons.Paladin, color: "F48CBA" },
  { name: ClassName.Priest, icon: classIcons.Priest, color: "FFFFFF" },
  { name: ClassName.Rogue, icon: classIcons.Rogue, color: "FFF468" },
  { name: ClassName.Shaman, icon: classIcons.Shaman, color: "0070DD" },
  { name: ClassName.Warlock, icon: classIcons.Warlock, color: "8788EE" },
  { name: ClassName.Warrior, icon: classIcons.Warrior, color: "C69B6D" },
];

export type Character = {
  name: string;
  class?: CharacterClass;
};

export type CharacterRecord = Character & { id: string };

/** WoW class colors are stored without a leading `#`. */
export function formatClassColorHex(color: string): string {
  return color.startsWith("#") ? color : `#${color}`;
}

/**TODO is it really required? */
function isLightClassColor(hexWithoutHash: string): boolean {
  const red = Number.parseInt(hexWithoutHash.slice(0, 2), 16);
  const green = Number.parseInt(hexWithoutHash.slice(2, 4), 16);
  const blue = Number.parseInt(hexWithoutHash.slice(4, 6), 16);
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;
  return luminance > 0.75;
}

/** Typography sx for a character name tinted with class color. */
export function characterNameDisplaySx(characterClass?: CharacterClass) {
  if (!characterClass) {
    return { fontWeight: 600 } as const;
  }
  const color = formatClassColorHex(characterClass.color);
  const needsContrastOnLight = isLightClassColor(characterClass.color);
  return {
    fontWeight: 600,
    color,
    ...(needsContrastOnLight
      ? { textShadow: "0 0 1px #18181b, 0 1px 2px rgba(24, 24, 27, 0.45)" }
      : {}),
  };
}
