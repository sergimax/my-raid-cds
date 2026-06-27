/**
 * Generates Titans guild BiS preset TypeScript from source.md (guild BiS lists).
 * Run: npm run generate:titans-bis
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "../..");
const sourceMd = path.join(__dirname, "source.md");
const dataDir = path.join(rootDir, "src/data");
const presetsDir = path.join(rootDir, "src/data/bis-presets");

const namesRu = JSON.parse(
  fs.readFileSync(path.join(dataDir, "wotlk-item-names-ru.json"), "utf8"),
);
const ilvls = JSON.parse(
  fs.readFileSync(path.join(dataDir, "wotlk-item-levels.json"), "utf8"),
);
const gearSlots = JSON.parse(
  fs.readFileSync(path.join(dataDir, "wotlk-item-gear-slots.json"), "utf8"),
);

/** Sanctified T10 (277) by class|spec. */
const T10_BY_SPEC = {
  "Warrior|Fury": { 0: 51227, 2: 51229, 4: 51225, 6: 51226, 8: 51228 },
  "Druid|Feral": { 0: 51296, 2: 51299, 4: 51300, 6: 51295, 8: 51297 },
  "Druid|Balance": { 0: 51290, 2: 51292, 4: 51294, 6: 51291, 8: 51293 },
  "Druid|Restoration": { 0: 51296, 2: 51299, 4: 51298, 6: 51291, 8: 51297 },
  "Priest|Shadow": { 0: 51255, 2: 51257, 4: 51259, 6: 51256, 8: 51258 },
  "Priest|Discipline": { 0: 51261, 2: 51264, 4: 51263, 6: 51260, 8: 51262 },
  "Mage|Arcane": { 0: 51281, 2: 51284, 4: 51283, 6: 51280, 8: 51282 },
  "Mage|Fire": { 0: 51281, 2: 51284, 4: 51283, 6: 51280, 8: 51282 },
  "Hunter|Marksmanship": { 0: 51286, 2: 51288, 4: 51289, 6: 51285, 8: 51287 },
  "Paladin|Retribution": { 0: 51277, 2: 51279, 4: 51275, 6: 51276, 8: 51278 },
  "Paladin|Protection": { 0: 51266, 2: 51269, 4: 51265, 6: 51267, 8: 51268 },
  "Paladin|Holy": { 0: 51272, 2: 51273, 4: 51274, 6: 51270, 8: 51271 },
  "Rogue|Combat": { 0: 51252, 2: 51254, 4: 51250, 6: 51251, 8: 51253 },
  "Death Knight|Unholy": { 0: 51312, 2: 51314, 4: 51310, 6: 51311, 8: 51313 },
  "Death Knight|Frost": { 0: 51312, 2: 51314, 4: 51310, 6: 51311, 8: 51313 },
  "Death Knight|Blood": { 0: 51306, 2: 51309, 4: 51305, 6: 51307, 8: 51308 },
  "Warlock|Demonology": { 0: 51231, 2: 51234, 4: 51233, 6: 51230, 8: 51232 },
  "Warlock|Affliction": { 0: 51231, 2: 51234, 4: 51233, 6: 51230, 8: 51232 },
  "Shaman|Elemental": { 0: 51247, 2: 51245, 4: 51249, 6: 51248, 8: 51246 },
  "Shaman|Restoration": { 0: 51247, 2: 51245, 4: 51249, 6: 51248, 8: 51246 },
  "Shaman|Enhancement": { 0: 51247, 2: 51245, 4: 51249, 6: 51248, 8: 51246 },
};

const MANUAL_ITEM_IDS = {
  "зов": 50737,
  "зов хаоса": 50737,
  "зов хаоса х2": 50737,
  "зов хаоса топор королей лордерона": 50737,
  "фалинраш": 50733,
  "фал'инраш": 50733,
  "клятвохранитель": 50735,
  "глоренцельг": 50730,
  "прилив": 50732,
  "катушка тенешелка": 50719,
  "шип для пронзания трупов": 50684,
  "кованая плетью секира": 50654,
  "сила тлеющей стали": 50672,
  "теренаска": 50734,
  "темная скорбь": 49623,
  "поручи полой тени": 54580,
  "солнечные часы вечного заката": 50635,
};

const SPEC_ENTRIES = [
  { header: /^#Фури/i, className: "Warrior", spec: "Fury", file: "fury-warrior.ts", export: "furyWarriorBis" },
  { header: /^#Кот\\?Ферал/i, className: "Druid", spec: "Feral", file: "feral-druid.ts", export: "feralDruidBis" },
  { header: /^#Сова\\?Баланс/i, className: "Druid", spec: "Balance", file: "balance-druid.ts", export: "balanceDruidBis" },
  { header: /^#Рестор \(друид\)/i, className: "Druid", spec: "Restoration", file: "restoration-druid.ts", export: "restorationDruidBis" },
  { header: /^#ШП/i, className: "Priest", spec: "Shadow", file: "shadow-priest.ts", export: "shadowPriestBis" },
  { header: /^#ДЦ/i, className: "Priest", spec: "Discipline", file: "discipline-priest.ts", export: "disciplinePriestBis" },
  { header: /^#Аркан/i, className: "Mage", spec: "Arcane", file: "arcane-mage.ts", export: "arcaneMageBis" },
  { header: /^#Фмаг/i, className: "Mage", spec: "Fire", file: "fire-mage.ts", export: "fireMageBis" },
  { header: /^#ММ/i, className: "Hunter", spec: "Marksmanship", file: "marksmanship-hunter.ts", export: "marksmanshipHunterBis" },
  { header: /^#Ретро/i, className: "Paladin", spec: "Retribution", file: "retribution-paladin.ts", export: "retributionPaladinBis" },
  { header: /^#Прото/i, className: "Paladin", spec: "Protection", file: "protection-paladin.ts", export: "protectionPaladinBis" },
  { header: /^#Холи \(Паладин\)/i, className: "Paladin", spec: "Holy", file: "holy-paladin.ts", export: "holyPaladinBis" },
  { header: /^#Комбат/i, className: "Rogue", spec: "Combat", file: "combat-rogue.ts", export: "combatRogueBis" },
  { header: /^#Анхоли/i, className: "Death Knight", spec: "Unholy", file: null, export: null, mergeInto: "unholy-death-knight.ts" },
  { header: /^#Фрост/i, className: "Death Knight", spec: "Frost", file: "frost-death-knight.ts", export: "frostDeathKnightBis" },
  { header: /^#БдкТАНК/i, className: "Death Knight", spec: "Blood", file: null, export: null, mergeInto: "blood-death-knight.ts" },
  { header: /^#Демон/i, className: "Warlock", spec: "Demonology", file: "demonology-warlock.ts", export: "demonologyWarlockBis" },
  { header: /^#Афли/i, className: "Warlock", spec: "Affliction", file: "affliction-warlock.ts", export: "afflictionWarlockBis" },
  { header: /^#Элем/i, className: "Shaman", spec: "Elemental", file: "elemental-shaman.ts", export: "elementalShamanBis" },
  { header: /^#Рестор \(Шаман\)/i, className: "Shaman", spec: "Restoration", file: "restoration-shaman.ts", export: "restorationShamanBis" },
  { header: /^#Энх/i, className: "Shaman", spec: "Enhancement", file: "enhancement-shaman.ts", export: "enhancementShamanBis" },
];

const SLOT_KEYS = {
  Голова: 0,
  Шея: 1,
  Плечо: 2,
  Плащ: 3,
  Грудь: 4,
  Запястья: 5,
  Кисти: 6,
  Пояс: 7,
  Ноги: 8,
  Ступни: 9,
  Кольца: "rings",
  Аксессуар: "trinkets",
  Оружие: "weapons",
};

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[`'"«»]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseSourceHint(source) {
  const sourceLower = source.toLowerCase();
  let targetIlvl = null;
  if (/рс.*25.*хм|rs.*25.*h/i.test(sourceLower)) targetIlvl = 284;
  else if (/цлк.*25.*хм|icc.*25.*h/i.test(sourceLower)) targetIlvl = 277;
  else if (/10.*хм/i.test(sourceLower)) targetIlvl = 264;
  else if (/ивк|toc.*25/i.test(sourceLower)) targetIlvl = 258;
  else if (/ульда|ulduar/i.test(sourceLower)) targetIlvl = 239;
  else if (/репа|rep/i.test(sourceLower)) targetIlvl = 277;
  else if (/за лёд|за лед|frost emblem/i.test(sourceLower)) targetIlvl = 264;
  else if (/триумф|triumph/i.test(sourceLower)) targetIlvl = 245;
  return { targetIlvl };
}

function manualItemId(itemName, className, spec) {
  const key = normalize(itemName);
  const manual = MANUAL_ITEM_IDS[key];
  if (typeof manual === "number") return manual;
  if (manual && typeof manual === "object") {
    return manual[`${className}|${spec}`] ?? manual.default;
  }
  return null;
}

function findItemIds(itemName, slotIdx, sourceHint, className, spec) {
  if (/^т10$/i.test(itemName.trim())) return null;

  const manualId = manualItemId(itemName, className, spec);
  if (manualId) return [manualId];

  const normalizedWant = normalize(itemName);
  const { targetIlvl } = parseSourceHint(sourceHint);
  const matches = [];

  for (const [id, name] of Object.entries(namesRu)) {
    const normalizedName = normalize(name);
    const nameMatch =
      normalizedName === normalizedWant ||
      normalizedName.includes(normalizedWant) ||
      normalizedWant.includes(normalizedName);
    if (!nameMatch) continue;
    const slots = gearSlots[id];
    if (slotIdx != null && slots && !slots.includes(slotIdx)) continue;
    matches.push({ id: Number(id), ilvl: ilvls[id] ?? 0, name });
  }

  matches.sort((first, second) => second.ilvl - first.ilvl);
  if (targetIlvl != null) {
    const ilvlMatches = matches.filter((match) => match.ilvl === targetIlvl);
    if (ilvlMatches.length > 0) return [ilvlMatches[0].id];
  }
  if (matches.length > 0) return [matches[0].id];
  return [];
}

function cleanItemPart(part) {
  return stripSourceHints(part.replace(/^[^:]+:\s*/i, "")).trim();
}

function stripSourceHints(value) {
  return value.replace(/\([^)]*\)/g, "").trim();
}

function splitItemParts(value) {
  const withoutAlt = stripSourceHints(value.split(/\s*\/\s*/)[0]);
  return withoutAlt
    .split(/\s*\+\s*/)
    .map((part) => cleanItemPart(part))
    .filter(Boolean);
}

function splitWeaponParts(value) {
  const primary = stripSourceHints(value.split(/\s*\/\s*/)[0]);
  if (primary.includes("+")) {
    return splitItemParts(value);
  }
  const splitPrefixes = [
    "Солнечные часы",
    "Катушка",
    "Шип для",
    "Сила тлеющей",
  ];
  for (const prefix of splitPrefixes) {
    const index = primary.indexOf(prefix);
    if (index > 0) {
      return [
        primary.slice(0, index).trim(),
        primary.slice(index).trim(),
      ];
    }
  }
  return [primary.trim()];
}

function assignWeaponSlots(parts, sourceHint, className, spec) {
  const assigned = [];
  const usedSlots = new Set();

  for (const rawPart of parts) {
    if (/^т10$/i.test(rawPart)) continue;
    const isDual = /х2$/i.test(rawPart);
    const part = cleanItemPart(rawPart);
    const itemIds = findItemIds(part, null, sourceHint, className, spec);
    if (!itemIds.length) {
      assigned.push({ slot: null, itemIds: [], label: part });
      continue;
    }
    const itemId = itemIds[0];
    const validSlots = (gearSlots[itemId] ?? []).filter((slot) => slot >= 14);
    if (isDual && validSlots.includes(14) && validSlots.includes(15)) {
      assigned.push({ slot: 14, itemIds: [itemId], label: part });
      assigned.push({ slot: 15, itemIds: [itemId], label: part });
      usedSlots.add(14);
      usedSlots.add(15);
      continue;
    }
    const slot = validSlots.find((candidate) => !usedSlots.has(candidate));
    if (slot != null) {
      assigned.push({ slot, itemIds: [itemId], label: part });
      usedSlots.add(slot);
    } else if (validSlots.length > 0) {
      assigned.push({ slot: validSlots[0], itemIds: [itemId], label: part });
    }
  }
  return assigned;
}

function parseSections(markdown) {
  const lines = markdown.split(/\r?\n/);
  const sections = [];
  let current = null;

  for (const line of lines) {
    const headerMatch = line.match(/^#(.+)/);
    if (headerMatch) {
      if (current) sections.push(current);
      const header = headerMatch[1].trim();
      current = {
        header,
        meta: SPEC_ENTRIES.find((entry) => entry.header.test(`#${header}`)),
        rows: [],
      };
      continue;
    }
    const rowMatch = line.match(/^\s*([^:]+):\s*(.+)$/);
    if (rowMatch && current) {
      current.rows.push({
        slotLabel: rowMatch[1].trim().replace(/^[^:]+:\s*/, ""),
        value: rowMatch[2].trim(),
      });
    }
  }
  if (current) sections.push(current);
  return sections;
}

function resolveSection(section) {
  const { className, spec } = section.meta;
  const t10Key = `${className}|${spec}`;
  const t10Map = T10_BY_SPEC[t10Key];
  const slotEntries = [];
  const unresolved = [];

  for (const row of section.rows) {
    const slotKey = SLOT_KEYS[row.slotLabel] ?? SLOT_KEYS[row.slotLabel.replace(/^.*:\s*/, "")];

    if (slotKey === "rings" || slotKey === "trinkets") {
      const parts = splitItemParts(row.value);
      const slotIndexes = slotKey === "rings" ? [10, 11] : [12, 13];
      for (let index = 0; index < parts.length && index < slotIndexes.length; index++) {
        slotEntries.push({
          slot: slotIndexes[index],
          itemIds: findItemIds(parts[index], slotIndexes[index], row.value, className, spec),
        });
      }
      continue;
    }

    if (slotKey === "weapons") {
      const parts = splitWeaponParts(row.value);
      slotEntries.push(...assignWeaponSlots(parts, row.value, className, spec));
      continue;
    }

    const parts = splitItemParts(row.value);
    const itemName = parts[0];
    if (/^т10$/i.test(itemName)) {
      const itemId = t10Map?.[slotKey];
      slotEntries.push({ slot: slotKey, itemIds: itemId ? [itemId] : [] });
      continue;
    }
    slotEntries.push({
      slot: slotKey,
      itemIds: findItemIds(itemName, slotKey, row.value, className, spec),
    });
  }

  const slotsByIndex = new Map();
  for (const entry of slotEntries) {
    if (entry.slot == null || !entry.itemIds?.length) {
      if (entry.label || entry.itemIds?.length === 0) unresolved.push(entry);
      continue;
    }
    slotsByIndex.set(entry.slot, {
      slot: entry.slot,
      itemIds: entry.itemIds,
    });
  }

  const slots = [...slotsByIndex.values()].sort((first, second) => first.slot - second.slot);
  return { className, spec, meta: section.meta, slots, unresolved };
}

function classNameEnum(className) {
  return `ClassName.${className.replace(/ /g, "")}`;
}

function formatPreset(slots) {
  const lines = slots.map(
    (entry) => `        { slot: ${entry.slot}, itemIds: [${entry.itemIds.join(", ")}] },`,
  );
  return lines.join("\n");
}

function writePresetFile(fileName, exportName, className, spec, slots) {
  const content = `import { ClassName } from "../../types/characters.ts";
import type { BuiltInSpecBis } from "../../types/bis-lists.ts";

/** WotLK BiS (ICC / RS tier) — Titans guild (${className} / ${spec}). */
export const ${exportName}: BuiltInSpecBis = {
  className: ClassName.${className.replace(/ /g, "")},
  spec: "${spec}",
  presets: [
    {
      id: "titans",
      name: "Titans",
      slots: [
${formatPreset(slots)}
      ],
    },
  ],
};
`;
  fs.writeFileSync(path.join(presetsDir, fileName), content, "utf8");
}

function mergeTitansPreset(fileName, slots) {
  const filePath = path.join(presetsDir, fileName);
  let source = fs.readFileSync(filePath, "utf8");
  source = source.replace(/\n    \{\n      id: "titans",[\s\S]*?\n    \},/g, "");
  const presetBlock = `    {
      id: "titans",
      name: "Titans",
      slots: [
${formatPreset(slots)}
      ],
    },`;
  const updated = source.replace(/(\n  \],)/, `\n${presetBlock}$1`);
  fs.writeFileSync(filePath, updated, "utf8");
}

const markdown = fs.readFileSync(sourceMd, "utf8");
const resolved = parseSections(markdown).map(resolveSection);
const newExports = [];

for (const result of resolved) {
  if (result.unresolved.length > 0) {
    console.warn(
      `${result.className} ${result.spec} unresolved:`,
      result.unresolved.map((entry) => entry.label ?? entry.slot),
    );
  }
  const { meta, slots, className, spec } = result;
  if (meta.mergeInto) {
    mergeTitansPreset(meta.mergeInto, slots);
  } else {
    writePresetFile(meta.file, meta.export, className, spec, slots);
    newExports.push({ file: meta.file, export: meta.export });
  }
}

const indexPath = path.join(presetsDir, "index.ts");
let indexSource = fs.readFileSync(indexPath, "utf8");

for (const { file, export: exportName } of newExports) {
  const importPath = `./${file.replace(/\.ts$/, ".ts")}`;
  if (!indexSource.includes(exportName)) {
    indexSource = indexSource.replace(
      /(import { furyWarriorBis } from "\.\/fury-warrior\.ts";)/,
      `$1\nimport { ${exportName} } from "${importPath}";`,
    );
    indexSource = indexSource.replace(
      /(  enhancementShamanBis,\n\];)/,
      `  ${exportName},\n$1`,
    );
  }
}

fs.writeFileSync(indexPath, indexSource, "utf8");
console.log("Generated Titans presets.");
