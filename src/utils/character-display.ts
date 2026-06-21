import type { CharacterClass } from "../types/characters.ts";

/** WoW class colors are stored without a leading `#`. */
export function formatClassColorHex(color: string): string {
  return color.startsWith("#") ? color : `#${color}`;
}

/** Light class colors (e.g. Priest, Rogue) need a shadow on light backgrounds. */
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
