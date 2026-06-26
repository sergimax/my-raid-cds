import itemNamesJson from "./wotlk-item-names.json";

const itemNames = itemNamesJson as Record<string, string>;

/** English item name from the bundled WowSims database, when known. */
export function getWotlkItemName(itemId: number): string | undefined {
  const name = itemNames[String(itemId)];
  return typeof name === "string" && name.length > 0 ? name : undefined;
}
