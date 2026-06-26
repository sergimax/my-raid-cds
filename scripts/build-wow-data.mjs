/**
 * Builds bundled WowSims data for the app from scripts/wowsims-db.json.
 *
 * Outputs:
 * - src/data/wotlk-item-names.json — English item names for bundled ilvl ids
 * - src/data/wotlk-item-names-ru.json — Russian names from WoWRoad (by item id)
 * - src/data/wotlk-item-gear-slots.json — valid gear slot indices per item id
 * - src/data/raid-loot-by-key.json — raid loot indexed by gear slot
 *
 * Pass --skip-ru to skip the WoWRoad Russian name fetch (network-heavy).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildItemGearSlotsMap, itemToGearSlots } from "./wow-item-gear-slots.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");

const WOWROAD_RU_LOCALE = 8;
const WOWROAD_FETCH_CONCURRENCY = 12;
const WOWROAD_FETCH_RETRIES = 2;

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

function buildRaidLoot(dbItems, itemLevelIds) {
  const bundledItemIds = new Set(itemLevelIds);
  const lootByKey = {};

  for (const [raidKey, zoneIds] of Object.entries(RAID_ZONE_IDS)) {
    const slotItems = {};

    for (const item of dbItems) {
      if (!bundledItemIds.has(String(item.id))) {
        continue;
      }

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

function parseWowRoadRussianName(responseText) {
  const match = responseText.match(/name_ruru:\s*'((?:\\.|[^'\\])*?)'/);
  if (!match) {
    return undefined;
  }

  return match[1].replaceAll("\\'", "'");
}

async function fetchWowRoadRussianName(itemId) {
  const url = `https://wowroad.info/ajax.php?item=${itemId}&power&locale=${WOWROAD_RU_LOCALE}`;

  for (let attempt = 0; attempt <= WOWROAD_FETCH_RETRIES; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { Accept: "text/javascript,*/*" },
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const responseText = await response.text();
      return parseWowRoadRussianName(responseText);
    } catch (error) {
      if (attempt === WOWROAD_FETCH_RETRIES) {
        console.warn(`WoWRoad name fetch failed for item ${itemId}:`, error);
        return undefined;
      }
      await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
    }
  }

  return undefined;
}

async function buildRussianItemNames(itemLevelIds) {
  if (itemLevelIds.length === 0) {
    return { names: {}, resolvedCount: 0, failedCount: 0 };
  }

  const workerCount = Math.min(WOWROAD_FETCH_CONCURRENCY, itemLevelIds.length);
  const chunkSize = Math.ceil(itemLevelIds.length / workerCount);
  const chunks = [];

  for (let start = 0; start < itemLevelIds.length; start += chunkSize) {
    chunks.push(itemLevelIds.slice(start, start + chunkSize));
  }

  const progress = {
    processed: 0,
    resolved: 0,
    logIfNeeded() {
      if (this.processed % 250 === 0 || this.processed === itemLevelIds.length) {
        console.log(
          `WoWRoad RU names: ${this.processed}/${itemLevelIds.length} processed (${this.resolved} resolved)`,
        );
      }
    },
    record(itemResolved) {
      this.processed += 1;
      if (itemResolved) {
        this.resolved += 1;
      }
      this.logIfNeeded();
    },
  };

  async function processChunk(chunk) {
    const chunkNames = {};
    let chunkResolved = 0;
    let chunkFailed = 0;

    for (const itemId of chunk) {
      const russianName = await fetchWowRoadRussianName(itemId);
      if (russianName) {
        chunkNames[itemId] = russianName;
        chunkResolved += 1;
        progress.record(true);
      } else {
        chunkFailed += 1;
        progress.record(false);
      }
    }

    return { chunkNames, chunkResolved, chunkFailed };
  }

  const chunkResults = await Promise.all(chunks.map((chunk) => processChunk(chunk)));

  const names = {};
  let resolvedCount = 0;
  let failedCount = 0;

  for (const result of chunkResults) {
    Object.assign(names, result.chunkNames);
    resolvedCount += result.chunkResolved;
    failedCount += result.chunkFailed;
  }

  return { names, resolvedCount, failedCount };
}

async function main() {
  const skipRu = process.argv.includes("--skip-ru");
  const dbPath = path.join(rootDir, "scripts/wowsims-db.json");
  const itemLevelsPath = path.join(rootDir, "src/data/wotlk-item-levels.json");
  const namesOutPath = path.join(rootDir, "src/data/wotlk-item-names.json");
  const namesRuOutPath = path.join(rootDir, "src/data/wotlk-item-names-ru.json");
  const gearSlotsOutPath = path.join(rootDir, "src/data/wotlk-item-gear-slots.json");
  const lootOutPath = path.join(rootDir, "src/data/raid-loot-by-key.json");

  const db = JSON.parse(fs.readFileSync(dbPath, "utf8"));
  const itemLevels = JSON.parse(fs.readFileSync(itemLevelsPath, "utf8"));
  const itemLevelIds = Object.keys(itemLevels);

  const names = buildItemNames(db.items, itemLevelIds);
  const gearSlotsByItemId = buildItemGearSlotsMap(db.items, itemLevelIds);
  const lootByKey = buildRaidLoot(db.items, itemLevelIds);

  fs.writeFileSync(namesOutPath, `${JSON.stringify(names)}\n`);
  fs.writeFileSync(gearSlotsOutPath, `${JSON.stringify(gearSlotsByItemId)}\n`);
  fs.writeFileSync(lootOutPath, `${JSON.stringify(lootByKey)}\n`);

  const slotCounts = Object.fromEntries(
    Object.entries(lootByKey).map(([raidKey, loot]) => [
      raidKey,
      Object.keys(loot.slots).length,
    ]),
  );

  console.log(`Wrote ${Object.keys(names).length} item names → ${namesOutPath}`);
  console.log(
    `Wrote ${Object.keys(gearSlotsByItemId).length} item gear slots → ${gearSlotsOutPath}`,
  );
  console.log(`Wrote raid loot for ${Object.keys(lootByKey).length} raids → ${lootOutPath}`);
  console.log("Slots covered per raid:", slotCounts);

  if (skipRu) {
    console.log("Skipped Russian item names (--skip-ru).");
    return;
  }

  console.log(
    `Fetching ${itemLevelIds.length} Russian item names from WoWRoad (concurrency ${WOWROAD_FETCH_CONCURRENCY})…`,
  );
  const { names: russianNames, resolvedCount, failedCount } =
    await buildRussianItemNames(itemLevelIds);

  fs.writeFileSync(namesRuOutPath, `${JSON.stringify(russianNames)}\n`);
  console.log(
    `Wrote ${Object.keys(russianNames).length} Russian item names (${failedCount} missing) → ${namesRuOutPath}`,
  );
  console.log(`Resolved ${resolvedCount}/${itemLevelIds.length} WoWRoad names.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
