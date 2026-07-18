import { buildItemIdMap } from "./build-item-id-map.ts";
import itemLevelsJson from "./wotlk-item-levels.json";

const itemLevelsById = buildItemIdMap(itemLevelsJson as Record<string, number>);

/** WotLK item level for a game item id, when known in the bundled WowSims database. */
export function getWotlkItemLevel(itemId: number): number | undefined {
  return itemLevelsById.get(itemId);
}
