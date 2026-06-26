import { specsForClass } from "../data/class-specs.ts";
import { Classes, ClassName, type ClassName as ClassNameType } from "../types/characters.ts";
import type { CharacterGearItem } from "../types/character-gear.ts";

type WowSimsExportGearItemRaw = {
  id?: unknown;
  enchant?: unknown;
  gems?: unknown;
};

export type ParsedWowSimsExport = {
  gearItems: CharacterGearItem[];
  exportName?: string;
  exportClass?: ClassNameType;
  exportSpec?: string;
  warnings: string[];
};

export type ParseWowSimsExportResult =
  | ({ ok: true } & ParsedWowSimsExport)
  | { ok: false; error: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeToken(value: string): string {
  return value.toLowerCase().replace(/[\s_-]+/g, "");
}

function parseExportClass(value: unknown): ClassNameType | undefined {
  if (typeof value !== "string" || value.trim() === "") {
    return undefined;
  }
  const normalized = normalizeToken(value);
  return Classes.find(
    (characterClass) => normalizeToken(characterClass.name) === normalized,
  )?.name;
}

function parseExportSpec(
  className: ClassNameType,
  value: unknown,
): string | undefined {
  if (typeof value !== "string" || value.trim() === "") {
    return undefined;
  }
  const normalized = normalizeToken(value);
  return specsForClass(className).find(
    (spec) => normalizeToken(spec) === normalized,
  );
}

function parseGearItem(
  value: unknown,
): Omit<CharacterGearItem, "slot"> | null {
  if (!isRecord(value)) {
    return null;
  }
  const raw = value as WowSimsExportGearItemRaw;
  if (typeof raw.id !== "number" || !Number.isInteger(raw.id) || raw.id <= 0) {
    return null;
  }

  const item: Omit<CharacterGearItem, "slot"> = { id: raw.id };

  if (typeof raw.enchant === "number" && Number.isInteger(raw.enchant) && raw.enchant > 0) {
    item.enchant = raw.enchant;
  }

  if (Array.isArray(raw.gems)) {
    const gems = raw.gems.filter(
      (gem): gem is number =>
        typeof gem === "number" && Number.isInteger(gem) && gem > 0,
    );
    if (gems.length > 0) {
      item.gems = gems;
    }
  }

  return item;
}

function parseGearItems(value: unknown): CharacterGearItem[] {
  if (!isRecord(value) || !Array.isArray(value.items)) {
    return [];
  }

  const gearItems: CharacterGearItem[] = [];
  value.items.forEach((entry, slotIndex) => {
    const item = parseGearItem(entry);
    if (item) {
      gearItems.push({ ...item, slot: slotIndex });
    }
  });
  return gearItems;
}

export function parseWowSimsExporterJson(
  rawText: string,
  expectedClassName?: ClassNameType,
): ParseWowSimsExportResult {
  const trimmed = rawText.trim();
  if (!trimmed) {
    return { ok: false, error: "Paste WowSimsExporter JSON to import gear." };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return { ok: false, error: "Invalid JSON. Copy the full export from /wse export." };
  }

  if (!isRecord(parsed)) {
    return { ok: false, error: "Export must be a JSON object." };
  }

  const gearItems = parseGearItems(parsed.gear);
  if (gearItems.length === 0) {
    return { ok: false, error: "No equipped items found in the export." };
  }

  const warnings: string[] = [];
  const exportClass = parseExportClass(parsed.class);
  const exportName =
    typeof parsed.name === "string" && parsed.name.trim() !== ""
      ? parsed.name.trim()
      : undefined;

  if (expectedClassName && exportClass && exportClass !== expectedClassName) {
    warnings.push(
      `Export class is ${exportClass}, but this character is ${expectedClassName}.`,
    );
  }

  let exportSpec: string | undefined;
  const specClass = expectedClassName ?? exportClass;
  if (specClass) {
    exportSpec = parseExportSpec(specClass, parsed.spec);
    if (
      typeof parsed.spec === "string" &&
      parsed.spec.trim() !== "" &&
      !exportSpec
    ) {
      warnings.push(`Could not match export spec "${parsed.spec}" for ${specClass}.`);
    }
  }

  return {
    ok: true,
    gearItems,
    exportName,
    exportClass,
    exportSpec,
    warnings,
  };
}

/** Map common exporter class tokens to internal class names (for tests and docs). */
export const WowSimsExportClassExamples: Record<string, ClassNameType> = {
  shaman: ClassName.Shaman,
  paladin: ClassName.Paladin,
};
