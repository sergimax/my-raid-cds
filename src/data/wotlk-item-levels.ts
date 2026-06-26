import itemLevelsJson from "./wotlk-item-levels.json";

const itemLevels = itemLevelsJson as Record<string, number>;

/** WotLK item level for a game item id, when known in the bundled WowSims database. */
export function getWotlkItemLevel(itemId: number): number | undefined {
  const level = itemLevels[String(itemId)];
  return typeof level === "number" ? level : undefined;
}
