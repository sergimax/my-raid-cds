/**
 * Parse scripts/bis-list-sources.md and write matching preset `.ts` files
 * under src/data/bis-presets/ (does not modify index.ts).
 *
 * Run: npm run generate:bis-sources
 *
 * Also writes scripts/bis-list-sources-resolved.json for debugging unresolved names.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");

const namesEn = JSON.parse(
  fs.readFileSync(path.join(rootDir, "src/data/wotlk-item-names.json"), "utf8"),
);
const namesRu = JSON.parse(
  fs.readFileSync(path.join(rootDir, "src/data/wotlk-item-names-ru.json"), "utf8"),
);
const gearSlotsByItemId = JSON.parse(
  fs.readFileSync(path.join(rootDir, "src/data/wotlk-item-gear-slots.json"), "utf8"),
);
const itemLevels = JSON.parse(
  fs.readFileSync(path.join(rootDir, "src/data/wotlk-item-levels.json"), "utf8"),
);

const nameToId = new Map();

function registerName(name, itemId) {
  const key = normalizeName(name);
  const existingId = nameToId.get(key);
  if (existingId === undefined) {
    nameToId.set(key, itemId);
    return;
  }

  const existingLevel = itemLevels[String(existingId)] ?? 0;
  const nextLevel = itemLevels[String(itemId)] ?? 0;
  if (nextLevel >= existingLevel) {
    nameToId.set(key, itemId);
  }
}

for (const [id, name] of Object.entries(namesEn)) {
  registerName(name, Number(id));
}
for (const [id, name] of Object.entries(namesRu)) {
  registerName(name, Number(id));
}

/** Informal / mistyped names from community guides. */
const NAME_ALIASES = {
  "bone sentinels amulet": "Bone Sentinel's Amulet",
  "professors bloodied smock": "Professor's Bloodied Smock",
  "ashen verdict": "Ashen Band of Endless Wisdom",
  "black willow": "Idol of the Black Willow",
  "althors abacus": "Althor's Abacus",
  "val'anyr, hammer of ancient kings": "Val'anyr, Hammer of Ancient Kings",
  "valanyr, hammer of ancient kings": "Val'anyr, Hammer of Ancient Kings",
  "sanguine silk robes": "Sanguine Silk Robes",
  "memory of malygos": "Memory of Malygos",
  "greatcloak of the turned champion": "Greatcloak of the Turned Champion",
  "glowing twilight scale": "Glowing Twilight Scale",
  "sundial of eternal dusk": "Sundial of Eternal Dusk",
  "boots of unnatural growth": "Boots of Unnatural Growth",
  "bracers of fiery night": "Bracers of Fiery Night",
  "верvie местi": "Astrylian's Sutured Cinch",
  [String.fromCharCode(0x0432, 0x0435, 0x0440, 0x0432, 0x0438, 0x0435, 0x0020, 0x043c, 0x0435, 0x0441, 0x0442, 0x0438)]: "Astrylian's Sutured Cinch",
  "перчатки анубарского охотника": "Anub'ar Stalker's Gloves",
  "шнурованный ремень нерубарского ловца": "Nerub'ar Stalker's Cord",
};

function normalizeName(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[''`´'\u2019]/g, "")
    .replace(/\s+/g, " ");
}

function resolveName(rawName) {
  let cleaned = rawName
    .replace(/^\[/, "")
    .replace(/\].*$/, "")
    .replace(/\s*\([^)]*\)\s*$/, "")
    .replace(/\s*за\b.*$/i, "")
    .replace(/\s*является\b.*$/i, "")
    .trim();

  const alias = NAME_ALIASES[normalizeName(cleaned)];
  if (alias) {
    cleaned = alias;
  }

  const id = nameToId.get(normalizeName(cleaned));
  return { cleaned, id };
}

const T10_BY_CONTEXT = {
  "enh shaman": {
    head: "Sanctified Frost Witch's Faceguard",
    shoulder: "Sanctified Frost Witch's Shoulderguards",
    chest: "Sanctified Frost Witch's Chestguard",
    legs: "Sanctified Frost Witch's War-Kilt",
  },
  "feral druid": {
    head: "Sanctified Lasherweave Headguard",
    shoulder: "Sanctified Lasherweave Shoulderpads",
    chest: "Sanctified Lasherweave Raiment",
    legs: "Sanctified Lasherweave Legguards",
  },
  "restoration druid": {
    head: "Sanctified Lasherweave Cover",
    shoulder: "Sanctified Lasherweave Mantle",
    hands: "Sanctified Lasherweave Gloves",
    legs: "Sanctified Lasherweave Trousers",
  },
};

const SLOT_LABELS = {
  head: 0,
  helm: 0,
  голова: 0,
  neck: 1,
  шея: 1,
  shoulder: 2,
  shoulders: 2,
  плечо: 2,
  плечи: 2,
  back: 3,
  cloak: 3,
  спина: 3,
  плащ: 3,
  chest: 4,
  грудь: 4,
  wrist: 5,
  wrists: 5,
  bracers: 5,
  запясть: 5,
  запястye: 5,
  запястья: 5,
  "запястья": 5,
  наручи: 5,
  hands: 6,
  hand: 6,
  перчатки: 6,
  руки: 6,
  waist: 7,
  belt: 7,
  пояс: 7,
  legs: 8,
  leg: 8,
  ноги: 8,
  feet: 9,
  foot: 9,
  boots: 9,
  ботинки: 9,
  "ring 1": 10,
  "ring1": 10,
  "кольцо 1": 10,
  "ring 2": 11,
  "ring2": 11,
  "кольцо 2": 11,
  "trinket 1": 12,
  "trinket1": 12,
  тринкет: 12,
  трынкет: 12,
  "trinket 2": 13,
  "trinket2": 13,
  weapon: 14,
  "main hand": 14,
  оружие: 14,
  "off hand": 15,
  relic: 16,
  idol: 16,
  totem: 16,
  тотем: 16,
};

const FLEXIBLE_SLOT_GROUPS = [
  [10, 11],
  [12, 13],
  [14, 15],
];

function nextFlexibleSlot(validSlots, usedSlots) {
  for (const group of FLEXIBLE_SLOT_GROUPS) {
    const matching = group.filter((slot) => validSlots.includes(slot));
    if (matching.length === 0) {
      continue;
    }
    const available = matching.find((slot) => !usedSlots.has(slot));
    if (available !== undefined) {
      return available;
    }
  }

  return validSlots.find((slot) => !usedSlots.has(slot));
}

function inferGearSlot(itemId, usedSlots) {
  const validSlots = gearSlotsByItemId[String(itemId)];
  if (!Array.isArray(validSlots) || validSlots.length === 0) {
    return undefined;
  }

  if (validSlots.length === 1) {
    return validSlots[0];
  }

  return nextFlexibleSlot(validSlots, usedSlots);
}

function parseHeading(heading) {
  const text = heading.replace(/^#\s*/, "").trim().toLowerCase();
  if (text.includes("unholy") && text.includes("dk")) {
    return { className: "Death Knight", spec: "Unholy", context: "unholy dk" };
  }
  if (text.includes("enh") && text.includes("shaman")) {
    return { className: "Shaman", spec: "Enhancement", context: "enh shaman" };
  }
  if (text.includes("feral") && text.includes("druid")) {
    return { className: "Druid", spec: "Feral", context: "feral druid" };
  }
  if (text.includes("restoration") && text.includes("druid")) {
    return { className: "Druid", spec: "Restoration", context: "restoration druid" };
  }
  if (text.includes("resto") && text.includes("druid")) {
    return { className: "Druid", spec: "Restoration", context: "restoration druid" };
  }
  throw new Error(`Unknown heading: ${heading}`);
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function splitLabelValue(line) {
  const match = line.match(/^(.+?)\s*(?:[:–—-])\s*(.+)$/);
  if (!match) {
    return null;
  }
  return { label: match[1].trim().toLowerCase(), value: match[2].trim() };
}

function parseLabeledLine(line, context) {
  const split = splitLabelValue(line);
  if (!split) {
    return null;
  }

  let { label, value } = split;

  if (label.startsWith("тринкет") || label.startsWith("трынкет")) {
    label = label.includes("2") ? "trinket 2" : "trinket 1";
  }

  let slot = SLOT_LABELS[label];
  if (slot === undefined && label.startsWith("зап")) {
    slot = 5;
  }
  if (slot === undefined) {
    return null;
  }

  if (/т10(?:\.\d+)?|t10(?:\.\d+)?/i.test(value)) {
    const bracket = value.match(/\[(.+?)\]/);
    if (bracket) {
      value = bracket[1];
    } else {
      const t10 = T10_BY_CONTEXT[context];
      const slotKey =
        slot === 0
          ? "head"
          : slot === 2
            ? "shoulder"
            : slot === 4
              ? "chest"
              : slot === 6
                ? "hands"
                : slot === 8
                  ? "legs"
                  : undefined;
      if (slotKey && t10?.[slotKey]) {
        value = t10[slotKey];
      }
    }
  }

  if (/х2|x2|\bx2\b/i.test(value)) {
    value = value.replace(/\s*х2\s*$/i, "").replace(/\s*x2\s*$/i, "").trim();
    const { cleaned, id } = resolveName(value);
    return { slot, itemNames: [cleaned], itemIds: id ? [id, id] : [], dualWield: true };
  }

  const parts = value.split(/\s+OR\s+|\s+или\s+/i);
  const itemNames = [];
  const itemIds = [];
  for (const part of parts) {
    const { cleaned, id } = resolveName(part);
    itemNames.push(cleaned);
    if (id) {
      itemIds.push(id);
    }
  }

  return { slot, itemNames, itemIds };
}

function parseEntries(markdown) {
  const blocks = markdown.split(/\n(?=# )/);
  const entries = [];

  for (const block of blocks) {
    const lines = block.split("\n").map((line) => line.trim());
    if (lines.length < 6) {
      continue;
    }

    const heading = lines[0];
    const server = lines[1];
    const author = lines[2];
    const url = lines[3];
    const presetName = lines[4];
    const { className, spec, context } = parseHeading(heading);

    const listLines = [];
    for (let index = 5; index < lines.length; index += 1) {
      if (!lines[index]) {
        continue;
      }
      listLines.push(lines[index]);
    }

    const slots = new Map();
    const usedSlots = new Set();
    const unknown = [];
    let isRestoTierBlock = false;

    function assignSlot(slot, itemIds, itemNames) {
      if (itemIds.length === 0) {
        unknown.push(...itemNames);
        return;
      }
      slots.set(slot, { itemIds, itemNames });
      usedSlots.add(slot);
    }

    function assignPlainItem(itemNames, itemIds) {
      if (itemIds.length === 0) {
        unknown.push(...itemNames);
        return;
      }

      if (itemIds.length === 2 && itemIds[0] === itemIds[1]) {
        assignSlot(14, [itemIds[0]], [itemNames[0]]);
        assignSlot(15, [itemIds[1]], [itemNames[1] ?? itemNames[0]]);
        return;
      }

      for (let index = 0; index < itemIds.length; index += 1) {
        const itemId = itemIds[index];
        const slot = inferGearSlot(itemId, usedSlots);
        if (slot === undefined) {
          unknown.push(itemNames[index] ?? String(itemId));
          continue;
        }
        const existing = slots.get(slot);
        if (existing) {
          assignSlot(slot, [...new Set([...existing.itemIds, itemId])], [
            ...existing.itemNames,
            itemNames[index],
          ]);
        } else {
          assignSlot(slot, [itemId], [itemNames[index]]);
        }
      }
    }

    for (const line of listLines) {
      if (/^tier 10/i.test(line)) {
        isRestoTierBlock = true;
        continue;
      }
      if (/^non tier/i.test(line)) {
        isRestoTierBlock = false;
        continue;
      }

      if (isRestoTierBlock) {
        const slotKey = line.toLowerCase();
        const t10 = T10_BY_CONTEXT[context];
        const slot =
          slotKey === "head"
            ? 0
            : slotKey === "shoulders"
              ? 2
              : slotKey === "hands"
                ? 6
                : slotKey === "legs"
                  ? 8
                  : undefined;
        if (slot !== undefined && t10) {
          const pieceKey =
            slot === 0 ? "head" : slot === 2 ? "shoulder" : slot === 6 ? "hands" : "legs";
          const { cleaned, id } = resolveName(t10[pieceKey]);
          if (id) {
            assignSlot(slot, [id], [cleaned]);
          } else {
            unknown.push(t10[pieceKey]);
          }
        }
        continue;
      }

      const labeled = parseLabeledLine(line, context);
      if (labeled) {
        if (labeled.dualWield && labeled.itemIds.length === 1) {
          assignSlot(14, [labeled.itemIds[0]], [labeled.itemNames[0]]);
          assignSlot(15, [labeled.itemIds[0]], [labeled.itemNames[0]]);
        } else if (labeled.itemIds.length > 0) {
          assignSlot(labeled.slot, labeled.itemIds, labeled.itemNames);
        } else {
          unknown.push(...labeled.itemNames);
        }
        continue;
      }

      const plainMatch = line.match(/^(.+?)\s+OR\s+(.+)$/i);
      if (plainMatch) {
        const itemIds = [];
        const itemNames = [];
        for (const part of [plainMatch[1], plainMatch[2]]) {
          const { cleaned, id } = resolveName(part.replace(/^[^:]+:\s*/, ""));
          itemNames.push(cleaned);
          if (id) {
            itemIds.push(id);
          }
        }
        if (itemIds.length > 0) {
          const slot = inferGearSlot(itemIds[0], usedSlots);
          if (slot !== undefined) {
            assignSlot(slot, itemIds, itemNames);
          } else {
            unknown.push(...itemNames);
          }
        } else {
          unknown.push(...itemNames);
        }
        continue;
      }

      const { cleaned, id } = resolveName(line.replace(/^[^:]+:\s*/, ""));
      assignPlainItem([cleaned], id ? [id] : []);
    }

    entries.push({
      className,
      spec,
      server,
      author,
      url,
      presetName,
      id: slugify(`${server}-${author}-${presetName}`),
      displayName: `${presetName} (${server} · ${author})`,
      slots: [...slots.entries()]
        .sort(([left], [right]) => left - right)
        .map(([slot, data]) => ({ slot, ...data })),
      unknown,
    });
  }

  return entries;
}

const markdown = fs.readFileSync(path.join(__dirname, "bis-list-sources.md"), "utf8");
const entries = parseEntries(markdown);

for (const entry of entries) {
  console.log("\n===", entry.className, entry.spec, entry.displayName, "===");
  if (entry.unknown.length > 0) {
    console.log("UNKNOWN:", entry.unknown);
  }
  for (const slot of entry.slots) {
    console.log(`  ${slot.slot}: [${slot.itemIds.join(", ")}] ${slot.itemNames.join(" / ")}`);
  }
}

fs.writeFileSync(
  path.join(__dirname, "bis-list-sources-resolved.json"),
  `${JSON.stringify(entries, null, 2)}\n`,
);
console.log("\nWrote scripts/bis-list-sources-resolved.json");

const CLASS_ENUM = {
  "Death Knight": "ClassName.DeathKnight",
  Druid: "ClassName.Druid",
  Shaman: "ClassName.Shaman",
};

const SPEC_OUTPUT = {
  "Death Knight|Unholy": {
    fileName: "unholy-death-knight.ts",
    exportName: "unholyDeathKnightBis",
    comment: "Unholy Death Knight",
  },
  "Shaman|Enhancement": {
    fileName: "enhancement-shaman.ts",
    exportName: "enhancementShamanBis",
    comment: "Enhancement Shaman",
  },
  "Druid|Feral": {
    fileName: "feral-druid.ts",
    exportName: "feralDruidBis",
    comment: "Feral Druid",
  },
  "Druid|Restoration": {
    fileName: "restoration-druid.ts",
    exportName: "restorationDruidBis",
    comment: "Restoration Druid",
  },
};

function normalizePresetSlots(slots) {
  const slotMap = new Map(slots.map((entry) => [entry.slot, [...entry.itemIds]]));

  const mainHand = slotMap.get(14);
  if (
    mainHand?.length === 2 &&
    mainHand[0] === mainHand[1] &&
    !slotMap.has(15)
  ) {
    slotMap.set(14, [mainHand[0]]);
    slotMap.set(15, [mainHand[1]]);
  }

  return [...slotMap.entries()]
    .sort(([leftSlot], [rightSlot]) => leftSlot - rightSlot)
    .map(([slot, itemIds]) => ({ slot, itemIds: [...new Set(itemIds)] }));
}

function formatPresetBlock(entry) {
  const slots = normalizePresetSlots(entry.slots);
  const slotLines = slots
    .map(
      (slotEntry) =>
        `        { slot: ${slotEntry.slot}, itemIds: [${slotEntry.itemIds.join(", ")}] },`,
    )
    .join("\n");

  return `    {
      id: "${entry.id}",
      name: ${JSON.stringify(entry.displayName)},
      slots: [
${slotLines}
      ],
    }`;
}

const grouped = new Map();
for (const entry of entries) {
  const key = `${entry.className}|${entry.spec}`;
  if (!grouped.has(key)) {
    grouped.set(key, []);
  }
  grouped.get(key).push(entry);
}

const presetDir = path.join(rootDir, "src/data/bis-presets");

for (const [key, specEntries] of grouped.entries()) {
  const meta = SPEC_OUTPUT[key];
  if (!meta) {
    throw new Error(`Missing SPEC_OUTPUT for ${key}`);
  }

  const [className, spec] = key.split("|");
  const presetBlocks = specEntries.map(formatPresetBlock).join(",\n");
  const sourceLines = specEntries
    .map((entry) => ` * @see ${entry.url}`)
    .join("\n");

  const fileContents = `import { ClassName } from "../../types/characters.ts";
import type { BuiltInSpecBis } from "../../types/bis-lists.ts";

/**
 * WotLK BiS presets for ${meta.comment} (community sources).
${sourceLines}
 */
export const ${meta.exportName}: BuiltInSpecBis = {
  className: ${CLASS_ENUM[className]},
  spec: ${JSON.stringify(spec)},
  presets: [
${presetBlocks},
  ],
};
`;

  fs.writeFileSync(path.join(presetDir, meta.fileName), fileContents);
  console.log(`Wrote src/data/bis-presets/${meta.fileName}`);
}
