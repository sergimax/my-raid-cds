import { ClassName, type ClassName as ClassNameType } from "../types/characters.ts";
import { isSpecValidForClass } from "./class-specs.ts";

/** GearScore2-style stat keys used in per-spec PvE weight tables. */
export type GsStatKey =
  | "STR"
  | "AGI"
  | "STA"
  | "INT"
  | "SPI"
  | "SP"
  | "AP"
  | "RAP"
  | "HIT"
  | "CRIT"
  | "HASTE"
  | "ARP"
  | "EXPERTISE"
  | "MP5"
  | "DEFENSE"
  | "DODGE"
  | "PARRY"
  | "BLOCK"
  | "BLOCKVALUE";

export type GsStatWeights = Partial<Record<GsStatKey, number>>;

export type SpecRole = "MELEE" | "RANGED" | "CASTER" | "HEALER" | "TANK";

export type SpecStatProfile = {
  role: SpecRole;
  /** Spellhance-style caster loot (Enhancement only in GearScore2). */
  hybridCasterItems?: boolean;
  /** Drop loot with +spirit (WotLK shamans do not use spirit on any spec). */
  rejectSpiritStats?: boolean;
  /** Ilvl hints: off-hand slot must be a shield (Restoration shaman). */
  offHandShieldOnly?: boolean;
  /** Primary PvE stat weights (GearScore2 `Tables.SpecProfiles` pve). */
  pve: GsStatWeights;
  /** Optional secondary weights when `hybridCasterItems` (Enhancement spellhance). */
  hybridPve?: GsStatWeights;
};

type SpecProfileKey =
  | "WARRIOR_ARMS"
  | "WARRIOR_FURY"
  | "WARRIOR_PROTECTION"
  | "PALADIN_HOLY"
  | "PALADIN_PROTECTION"
  | "PALADIN_RETRIBUTION"
  | "HUNTER_BEASTMASTERY"
  | "HUNTER_MARKSMANSHIP"
  | "HUNTER_SURVIVAL"
  | "ROGUE_ASSASSINATION"
  | "ROGUE_COMBAT"
  | "ROGUE_SUBTLETY"
  | "PRIEST_DISCIPLINE"
  | "PRIEST_HOLY"
  | "PRIEST_SHADOW"
  | "DEATHKNIGHT_BLOOD"
  | "DEATHKNIGHT_FROST"
  | "DEATHKNIGHT_UNHOLY"
  | "SHAMAN_ELEMENTAL"
  | "SHAMAN_ENHANCEMENT"
  | "SHAMAN_RESTORATION"
  | "MAGE_ARCANE"
  | "MAGE_FIRE"
  | "MAGE_FROST"
  | "WARLOCK_AFFLICTION"
  | "WARLOCK_DEMONOLOGY"
  | "WARLOCK_DESTRUCTION"
  | "DRUID_BALANCE"
  | "DRUID_FERAL_DPS"
  | "DRUID_RESTORATION";

/** PvE weights sourced from GearScore2 `Data/RuntimeTables.lua` (cozawariat/gearscore2). */
const SPEC_PROFILES: Record<SpecProfileKey, SpecStatProfile> = {
  WARRIOR_ARMS: {
    role: "MELEE",
    pve: { STR: 3.15, CRIT: 1.65, HIT: 2.2, HASTE: 1.05, ARP: 1.65, AP: 1.65, EXPERTISE: 1.8 },
  },
  WARRIOR_FURY: {
    role: "MELEE",
    pve: { STR: 2.35, CRIT: 1.15, HIT: 1.8, HASTE: 0.72, ARP: 0.92, AP: 0.98, EXPERTISE: 1.3 },
  },
  WARRIOR_PROTECTION: {
    role: "TANK",
    pve: {
      STA: 1.7,
      STR: 0.85,
      DEFENSE: 2.4,
      DODGE: 2.0,
      PARRY: 1.9,
      BLOCK: 1.75,
      BLOCKVALUE: 1.2,
      HIT: 0.95,
      EXPERTISE: 1.1,
    },
  },
  PALADIN_HOLY: {
    role: "HEALER",
    pve: { INT: 2.2, SP: 2.5, HASTE: 1.35, CRIT: 1.15, MP5: 1.35, SPI: 0.4 },
  },
  PALADIN_PROTECTION: {
    role: "TANK",
    pve: {
      STA: 1.65,
      STR: 0.82,
      DEFENSE: 2.4,
      DODGE: 1.9,
      PARRY: 1.8,
      BLOCK: 1.65,
      BLOCKVALUE: 1.18,
      HIT: 0.9,
      EXPERTISE: 1.05,
    },
  },
  PALADIN_RETRIBUTION: {
    role: "MELEE",
    pve: { STR: 4.55, CRIT: 2.45, HIT: 3.0, HASTE: 2.0, EXPERTISE: 2.85, ARP: 2.75, AP: 2.3 },
  },
  HUNTER_BEASTMASTERY: {
    role: "RANGED",
    pve: { AGI: 1.85, RAP: 1.0, AP: 0.62, HIT: 1.25, CRIT: 0.95, HASTE: 0.65, ARP: 0.7 },
  },
  HUNTER_MARKSMANSHIP: {
    role: "RANGED",
    pve: { AGI: 2.45, RAP: 1.4, AP: 0.8, HIT: 1.65, CRIT: 1.35, HASTE: 0.9, ARP: 1.45 },
  },
  HUNTER_SURVIVAL: {
    role: "RANGED",
    pve: { AGI: 2.0, RAP: 1.0, AP: 0.58, HIT: 1.28, CRIT: 0.92, HASTE: 0.68 },
  },
  ROGUE_ASSASSINATION: {
    role: "MELEE",
    pve: { AGI: 1.12, AP: 0.48, HIT: 0.7, HASTE: 0.36, CRIT: 0.55, EXPERTISE: 0.55 },
  },
  ROGUE_COMBAT: {
    role: "MELEE",
    pve: { AGI: 1.04, AP: 0.42, HIT: 0.68, HASTE: 0.36, CRIT: 0.52, ARP: 0.47, EXPERTISE: 0.53 },
  },
  ROGUE_SUBTLETY: {
    role: "MELEE",
    pve: { AGI: 1.8, AP: 0.88, HIT: 1.3, HASTE: 0.66, CRIT: 0.9, ARP: 0.76, EXPERTISE: 0.95 },
  },
  PRIEST_DISCIPLINE: {
    role: "HEALER",
    pve: { INT: 1.7, SP: 1.9, CRIT: 0.95, HASTE: 0.85, MP5: 0.8, SPI: 0.5 },
  },
  PRIEST_HOLY: {
    role: "HEALER",
    pve: { INT: 1.95, SP: 2.45, HASTE: 1.3, CRIT: 1.3, SPI: 1.35, MP5: 0.95 },
  },
  PRIEST_SHADOW: {
    role: "CASTER",
    pve: { INT: 1.0, SP: 1.45, HIT: 0.8, HASTE: 0.5, CRIT: 0.42, SPI: 0.35 },
  },
  DEATHKNIGHT_BLOOD: {
    role: "TANK",
    pve: { STA: 2.35, STR: 1.45, DEFENSE: 2.95, DODGE: 2.35, PARRY: 2.35, HIT: 1.15, EXPERTISE: 1.35 },
  },
  DEATHKNIGHT_FROST: {
    role: "MELEE",
    pve: { STR: 2.4, HIT: 1.65, HASTE: 1.0, CRIT: 1.0, EXPERTISE: 1.25, AP: 0.92 },
  },
  DEATHKNIGHT_UNHOLY: {
    role: "MELEE",
    pve: { STR: 2.35, HIT: 1.65, HASTE: 1.15, CRIT: 1.05, EXPERTISE: 1.2, AP: 0.95 },
  },
  SHAMAN_ELEMENTAL: {
    role: "CASTER",
    rejectSpiritStats: true,
    pve: { INT: 1.0, SP: 1.55, HIT: 0.95, HASTE: 0.65, CRIT: 0.55, MP5: 0.45 },
  },
  SHAMAN_ENHANCEMENT: {
    role: "MELEE",
    hybridCasterItems: true,
    rejectSpiritStats: true,
    pve: { AGI: 2.45, AP: 1.5, HIT: 2.2, HASTE: 1.7, CRIT: 1.45, EXPERTISE: 1.8 },
    hybridPve: { INT: 1.0, SP: 1.55, HIT: 0.95, HASTE: 0.65, CRIT: 0.55, MP5: 0.45 },
  },
  SHAMAN_RESTORATION: {
    role: "HEALER",
    rejectSpiritStats: true,
    offHandShieldOnly: true,
    pve: { INT: 2.0, SP: 2.25, HASTE: 1.3, CRIT: 0.95, MP5: 1.15 },
  },
  MAGE_ARCANE: {
    role: "CASTER",
    pve: { INT: 1.55, SP: 2.15, HIT: 1.35, HASTE: 0.9, CRIT: 0.85, SPI: 0.3 },
  },
  MAGE_FIRE: {
    role: "CASTER",
    pve: { INT: 1.2, SP: 2.0, HIT: 1.15, HASTE: 0.85, CRIT: 0.75, SPI: 0.2 },
  },
  MAGE_FROST: {
    role: "CASTER",
    pve: { INT: 1.45, SP: 2.1, HIT: 1.35, HASTE: 0.9, CRIT: 0.85 },
  },
  WARLOCK_AFFLICTION: {
    role: "CASTER",
    pve: { INT: 1.5, SP: 2.25, HIT: 1.55, HASTE: 0.95, CRIT: 0.8, SPI: 0.4 },
  },
  WARLOCK_DEMONOLOGY: {
    role: "CASTER",
    pve: { INT: 1.5, SP: 2.2, HIT: 1.45, HASTE: 0.9, CRIT: 0.9, SPI: 0.3 },
  },
  WARLOCK_DESTRUCTION: {
    role: "CASTER",
    pve: { INT: 2.0, SP: 2.65, HIT: 1.85, HASTE: 1.2, CRIT: 1.15, SPI: 0.45 },
  },
  DRUID_BALANCE: {
    role: "CASTER",
    pve: { INT: 2.4, SP: 3.0, HIT: 2.15, HASTE: 1.6, CRIT: 1.35, SPI: 1.3 },
  },
  DRUID_FERAL_DPS: {
    role: "MELEE",
    pve: { AGI: 2.2, AP: 0.95, HIT: 1.45, HASTE: 0.7, CRIT: 1.05, ARP: 1.0, EXPERTISE: 1.05 },
  },
  DRUID_RESTORATION: {
    role: "HEALER",
    pve: { INT: 3.2, SP: 3.3, HASTE: 2.1, CRIT: 1.25, MP5: 1.55, SPI: 1.65 },
  },
};

const CLASS_SPEC_TO_PROFILE_KEY: Record<ClassNameType, Record<string, SpecProfileKey>> = {
  [ClassName.DeathKnight]: {
    Blood: "DEATHKNIGHT_BLOOD",
    Frost: "DEATHKNIGHT_FROST",
    Unholy: "DEATHKNIGHT_UNHOLY",
  },
  [ClassName.Druid]: {
    Balance: "DRUID_BALANCE",
    Feral: "DRUID_FERAL_DPS",
    Restoration: "DRUID_RESTORATION",
  },
  [ClassName.Hunter]: {
    "Beast Mastery": "HUNTER_BEASTMASTERY",
    Marksmanship: "HUNTER_MARKSMANSHIP",
    Survival: "HUNTER_SURVIVAL",
  },
  [ClassName.Mage]: {
    Arcane: "MAGE_ARCANE",
    Fire: "MAGE_FIRE",
    Frost: "MAGE_FROST",
  },
  [ClassName.Paladin]: {
    Holy: "PALADIN_HOLY",
    Protection: "PALADIN_PROTECTION",
    Retribution: "PALADIN_RETRIBUTION",
  },
  [ClassName.Priest]: {
    Discipline: "PRIEST_DISCIPLINE",
    Holy: "PRIEST_HOLY",
    Shadow: "PRIEST_SHADOW",
  },
  [ClassName.Rogue]: {
    Assassination: "ROGUE_ASSASSINATION",
    Combat: "ROGUE_COMBAT",
    Subtlety: "ROGUE_SUBTLETY",
  },
  [ClassName.Shaman]: {
    Elemental: "SHAMAN_ELEMENTAL",
    Enhancement: "SHAMAN_ENHANCEMENT",
    Restoration: "SHAMAN_RESTORATION",
  },
  [ClassName.Warlock]: {
    Affliction: "WARLOCK_AFFLICTION",
    Demonology: "WARLOCK_DEMONOLOGY",
    Destruction: "WARLOCK_DESTRUCTION",
  },
  [ClassName.Warrior]: {
    Arms: "WARRIOR_ARMS",
    Fury: "WARRIOR_FURY",
    Protection: "WARRIOR_PROTECTION",
  },
};

export function getSpecStatProfile(
  className: ClassNameType,
  spec: string,
): SpecStatProfile | undefined {
  if (!isSpecValidForClass(className, spec)) {
    return undefined;
  }

  const profileKey = CLASS_SPEC_TO_PROFILE_KEY[className][spec];
  return profileKey ? SPEC_PROFILES[profileKey] : undefined;
}
