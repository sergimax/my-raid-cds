/**
 * Builds bundled WowSims data for the app from scripts/wowsims-db.json.
 *
 * Outputs:
 * - src/data/wotlk-item-names.json — English item names for bundled ilvl ids
 * - src/data/raid-loot-by-key.json — raid loot indexed by gear slot
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");

/** WowSims drop zone ids grouped by template raid key. */
const RAID_ZONE_IDS = {
  naxxramas: [3456],
  obsidianSanctum: [4493, 4494],
  onyxiasLair: [2159],
  vaultOfArchavon: [4603],
  trialOfTheCrusader: [4722, 4723],
  ulduar: [4273],
  icecrownCitadel: [4812, 4813, 4820, 4809],
  rubySanctum: [4987],
};

function itemToGearSlots(item) {
  const itemType = item.type;
  if (itemType >= 1 && itemType <= 10) {
    return [itemType - 1];
  }
  if (itemType === 11) {
    return [10, 11];
  }
  if (itemType === 12) {
    return [12, 13];
  }
  if (itemType === 13) {
    const handType = item.handType;
    if (handType === 3) {
      return [15];
    }
    if (handType === 4 || handType === 1) {
      return [14];
    }
    return [14, 15];
  }
  if (itemType === 14) {
    return [16];
  }
  return [];
}

function dropsInZones(item, zoneIds) {
  const zoneSet = new Set(zoneIds);
  return (item.sources ?? []).some(
    (source) => source.drop && zoneSet.has(source.drop.zoneId),
  );
}

function buildItemNames(dbItems, itemLevelIds) {
  const itemsById = new Map(dbItems.map((item) => [item.id, item]));
  const names = {};

  for (const itemId of itemLevelIds) {
    const item = itemsById.get(Number(itemId));
    if (item?.name) {
      names[itemId] = item.name;
    }
  }

  return names;
}

function buildRaidLoot(dbItems) {
  const lootByKey = {};

  for (const [raidKey, zoneIds] of Object.entries(RAID_ZONE_IDS)) {
    const slotItems = {};

    for (const item of dbItems) {
      if (!dropsInZones(item, zoneIds)) {
        continue;
      }

      for (const slot of itemToGearSlots(item)) {
        const slotKey = String(slot);
        if (!slotItems[slotKey]) {
          slotItems[slotKey] = new Set();
        }
        slotItems[slotKey].add(item.id);
      }
    }

    const slots = {};
    for (const [slotKey, itemIds] of Object.entries(slotItems)) {
      slots[slotKey] = {
        items: [...itemIds].sort((leftId, rightId) => leftId - rightId),
      };
    }

    lootByKey[raidKey] = { slots };
  }

  return lootByKey;
}

function main() {
  const dbPath = path.join(rootDir, "scripts/wowsims-db.json");
  const itemLevelsPath = path.join(rootDir, "src/data/wotlk-item-levels.json");
  const namesOutPath = path.join(rootDir, "src/data/wotlk-item-names.json");
  const lootOutPath = path.join(rootDir, "src/data/raid-loot-by-key.json");

  const db = JSON.parse(fs.readFileSync(dbPath, "utf8"));
  const itemLevels = JSON.parse(fs.readFileSync(itemLevelsPath, "utf8"));
  const itemLevelIds = Object.keys(itemLevels);

  const names = buildItemNames(db.items, itemLevelIds);
  const lootByKey = buildRaidLoot(db.items);

  fs.writeFileSync(namesOutPath, `${JSON.stringify(names)}\n`);
  fs.writeFileSync(lootOutPath, `${JSON.stringify(lootByKey)}\n`);

  const slotCounts = Object.fromEntries(
    Object.entries(lootByKey).map(([raidKey, loot]) => [
      raidKey,
      Object.keys(loot.slots).length,
    ]),
  );

  console.log(`Wrote ${Object.keys(names).length} item names → ${namesOutPath}`);
  console.log(`Wrote raid loot for ${Object.keys(lootByKey).length} raids → ${lootOutPath}`);
  console.log("Slots covered per raid:", slotCounts);
}

main();
