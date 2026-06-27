/**
 * Parses scripts/titans-bis/source.md and resolves item IDs (debug / inspect).
 * Run: node scripts/titans-bis/parse.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "../..");
const sourceMd = path.join(__dirname, "source.md");
const dataDir = path.join(rootDir, "src/data");

const namesRu = JSON.parse(
  fs.readFileSync(path.join(dataDir, "wotlk-item-names-ru.json"), "utf8"),
);
const ilvls = JSON.parse(
  fs.readFileSync(path.join(dataDir, "wotlk-item-levels.json"), "utf8"),
);
const gearSlots = JSON.parse(
  fs.readFileSync(path.join(dataDir, "wotlk-item-gear-slots.json"), "utf8"),
);

/** Sanctified T10 (277) by class + slot index. */
const T10_BY_CLASS = {
  Warrior: { 0: 51210, 2: 51213, 4: 51209, 6: 51211, 8: 51208 },
  Druid: { 0: 51290, 2: 51293, 4: 51289, 6: 51291, 8: 51288 },
  Priest: { 0: 51259, 2: 51262, 4: 51258, 6: 51260, 8: 51257 },
  Mage: { 0: 51205, 2: 51208, 4: 51204, 6: 51206, 8: 51203 },
  Hunter: { 0: 51220, 2: 51223, 4: 51219, 6: 51221, 8: 51218 },
  Paladin: { 0: 51275, 2: 51278, 4: 51274, 6: 51276, 8: 51273 },
  Rogue: { 0: 51250, 2: 51253, 4: 51249, 6: 51251, 8: 51248 },
  "Death Knight": { 0: 51312, 2: 51314, 4: 51310, 6: 51311, 8: 51313 },
  Warlock: { 0: 51230, 2: 51233, 4: 51229, 6: 51231, 8: 51228 },
  Shaman: { 0: 51240, 2: 51243, 4: 51239, 6: 51241, 8: 51238 },
};

/** Blood tank uses plate tank T10 (Scourgelord faceguard set). */
const T10_BLOOD_DK = { 0: 51306, 2: 51309, 4: 51305, 6: 51307, 8: 51308 };

const SPEC_MAP = [
  { header: /#Фури/i, className: "Warrior", spec: "Fury" },
  { header: /#Кот\\?Ферал/i, className: "Druid", spec: "Feral" },
  { header: /#Сова\\?Баланс/i, className: "Druid", spec: "Balance" },
  { header: /#Рестор \(друид\)/i, className: "Druid", spec: "Restoration" },
  { header: /#ШП/i, className: "Priest", spec: "Shadow" },
  { header: /#ДЦ/i, className: "Priest", spec: "Discipline" },
  { header: /#Аркан/i, className: "Mage", spec: "Arcane" },
  { header: /#Фмаг/i, className: "Mage", spec: "Fire" },
  { header: /#ММ/i, className: "Hunter", spec: "Marksmanship" },
  { header: /#Ретро/i, className: "Paladin", spec: "Retribution" },
  { header: /#Прото/i, className: "Paladin", spec: "Protection" },
  { header: /#Холи \(Паладин\)/i, className: "Paladin", spec: "Holy" },
  { header: /#Комбат/i, className: "Rogue", spec: "Combat" },
  { header: /#Анхоли/i, className: "Death Knight", spec: "Unholy" },
  { header: /#Фрост/i, className: "Death Knight", spec: "Frost" },
  { header: /#БдкТАНК/i, className: "Death Knight", spec: "Blood", bloodTank: true },
  { header: /#Демон/i, className: "Warlock", spec: "Demonology" },
  { header: /#Афли/i, className: "Warlock", spec: "Affliction" },
  { header: /#Элем/i, className: "Shaman", spec: "Elemental" },
  { header: /#Рестор \(Шаман\)/i, className: "Shaman", spec: "Restoration" },
  { header: /#Энх/i, className: "Shaman", spec: "Enhancement" },
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
  const heroic = /хм|геро/i.test(sourceLower);
  let targetIlvl = null;
  if (/рс.*25.*хм|rs.*25.*h/i.test(sourceLower)) {
    targetIlvl = 284;
  } else if (/цлк.*25.*хм|icc.*25.*h/i.test(sourceLower)) {
    targetIlvl = 277;
  } else if (/10.*хм/i.test(sourceLower)) {
    targetIlvl = 264;
  } else if (/ивк|toc.*25/i.test(sourceLower)) {
    targetIlvl = 258;
  } else if (/ульда|ulduar/i.test(sourceLower)) {
    targetIlvl = 239;
  } else if (/репа|rep/i.test(sourceLower)) {
    targetIlvl = 277;
  } else if (/за лёд|за лед|frost emblem/i.test(sourceLower)) {
    targetIlvl = 264;
  } else if (/триумф|triumph/i.test(sourceLower)) {
    targetIlvl = 245;
  } else if (/крафт|craft/i.test(sourceLower)) {
    targetIlvl = null;
  }
  return { heroic, targetIlvl };
}

function findItemIds(itemName, slotIdx, sourceHint = "") {
  if (/^т10$/i.test(itemName.trim())) {
    return null;
  }

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

    matches.push({
      id: Number(id),
      ilvl: ilvls[id] ?? 0,
      name,
    });
  }

  matches.sort((first, second) => second.ilvl - first.ilvl);

  if (targetIlvl != null) {
    const ilvlMatches = matches.filter((match) => match.ilvl === targetIlvl);
    if (ilvlMatches.length === 1) return [ilvlMatches[0].id];
    if (ilvlMatches.length > 1) {
      return [ilvlMatches[0].id];
    }
  }

  if (matches.length === 1) return [matches[0].id];
  if (matches.length > 1) return [matches[0].id];
  return [];
}

function cleanItemPart(part) {
  return part
    .replace(/^[^:]+:\s*/i, "")
    .replace(/\([^)]*\)/g, "")
    .trim();
}

function splitItems(value) {
  const primary = value.split(/\s*\/\s*/)[0].trim();
  return primary
    .split(/\s*\+\s*/)
    .map((part) => cleanItemPart(part))
    .filter(Boolean);
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
        meta: SPEC_MAP.find((entry) => entry.header.test(`#${header}`)),
        rows: [],
      };
      continue;
    }

    const rowMatch = line.match(/^\s*([^:]+):\s*(.+)$/);
    if (rowMatch && current) {
      current.rows.push({
        slotLabel: rowMatch[1].trim(),
        value: rowMatch[2].trim(),
      });
    }
  }
  if (current) sections.push(current);
  return sections;
}

function resolveT10(className, slotIdx, bloodTank) {
  const map = bloodTank ? T10_BLOOD_DK : T10_BY_CLASS[className];
  return map?.[slotIdx] ?? null;
}

function resolveSection(section) {
  if (!section.meta) {
    return { error: `Unknown spec header: ${section.header}` };
  }

  const { className, spec, bloodTank } = section.meta;
  const slots = [];
  const unresolved = [];
  const ambiguous = [];

  for (const row of section.rows) {
    const slotKey = SLOT_KEYS[row.slotLabel.replace(/^[^:]+:\s*/, "")] ??
      SLOT_KEYS[row.slotLabel];

    if (slotKey === "rings") {
      const parts = splitItems(row.value);
      if (parts.length >= 1) {
        slots.push({
          slot: 10,
          itemIds: findItemIds(parts[0], 10, row.value),
          label: parts[0],
        });
      }
      if (parts.length >= 2) {
        slots.push({
          slot: 11,
          itemIds: findItemIds(parts[1], 11, row.value),
          label: parts[1],
        });
      }
      continue;
    }

    if (slotKey === "trinkets") {
      const parts = splitItems(row.value);
      if (parts.length >= 1) {
        slots.push({
          slot: 12,
          itemIds: findItemIds(parts[0], 12, row.value),
          label: parts[0],
        });
      }
      if (parts.length >= 2) {
        slots.push({
          slot: 13,
          itemIds: findItemIds(parts[1], 13, row.value),
          label: parts[1],
        });
      }
      continue;
    }

    if (slotKey === "weapons") {
      const parts = splitItems(row.value);
      const weaponSlots = [14, 15, 16];
      for (let index = 0; index < parts.length && index < weaponSlots.length; index++) {
        const part = parts[index];
        if (/^т10$/i.test(part)) continue;
        const slotIdx = weaponSlots[index];
        slots.push({
          slot: slotIdx,
          itemIds: findItemIds(part, slotIdx, row.value),
          label: part,
        });
      }
      continue;
    }

    const parts = splitItems(row.value);
    const itemName = parts[0];
    if (/^т10$/i.test(itemName)) {
      const itemId = resolveT10(className, slotKey, bloodTank);
      if (itemId) {
        slots.push({ slot: slotKey, itemIds: [itemId], label: "т10" });
      } else {
        unresolved.push({ slot: slotKey, label: "т10", value: row.value });
      }
      continue;
    }

    const itemIds = findItemIds(itemName, slotKey, row.value);
    slots.push({ slot: slotKey, itemIds, label: itemName });
  }

  for (const entry of slots) {
    if (!entry.itemIds?.length) {
      unresolved.push(entry);
    }
  }

  return { className, spec, slots, unresolved };
}

const markdown = fs.readFileSync(sourceMd, "utf8");
const sections = parseSections(markdown);
const results = sections.map(resolveSection);

console.log(JSON.stringify(results, null, 2));

const problemCount = results.reduce(
  (count, result) => count + (result.unresolved?.length ?? 0),
  0,
);
console.error(`\nUnresolved: ${problemCount}`);
