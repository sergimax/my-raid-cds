import {
  getSpecStatProfile,
  type GsStatKey,
  type GsStatWeights,
  type SpecStatProfile,
} from "../data/spec-stat-priorities.ts";
import { getWotlkItemEquipProps } from "../data/wotlk-item-equip-props.ts";
import { WowSimsItemStat } from "../data/wowsims-item-stat.ts";
import {
  getWotlkItemStats,
  type ItemStatFitContext,
  type WotlkItemStatsSparse,
} from "../data/wotlk-item-stats.ts";

/** WowSims gear slot / item type (mirrors item-equip-restrictions.ts). */
const GearSlotOffHand = 15;
const ItemTypeWeapon = 13;
const WeaponTypeShield = 7;

type NormalizedGsStats = Partial<Record<GsStatKey, number>>;

type RoleSignature = "TANK" | "HEALER" | "CASTER" | "RANGED" | "MELEE";

const WOWSIMS_INDEX_TO_GS_STAT: Partial<Record<number, GsStatKey>> = {
  [WowSimsItemStat.Strength]: "STR",
  [WowSimsItemStat.Agility]: "AGI",
  [WowSimsItemStat.Stamina]: "STA",
  [WowSimsItemStat.Intellect]: "INT",
  [WowSimsItemStat.Spirit]: "SPI",
  [WowSimsItemStat.SpellPower]: "SP",
  [WowSimsItemStat.MP5]: "MP5",
  [WowSimsItemStat.SpellHit]: "HIT",
  [WowSimsItemStat.SpellCrit]: "CRIT",
  [WowSimsItemStat.SpellHaste]: "HASTE",
  [WowSimsItemStat.AttackPower]: "AP",
  [WowSimsItemStat.MeleeHit]: "HIT",
  [WowSimsItemStat.MeleeCrit]: "CRIT",
  [WowSimsItemStat.MeleeHaste]: "HASTE",
  [WowSimsItemStat.ArmorPenetration]: "ARP",
  [WowSimsItemStat.Expertise]: "EXPERTISE",
  [WowSimsItemStat.RangedAttackPower]: "RAP",
};

function statValue(stats: NormalizedGsStats, key: GsStatKey): number {
  return stats[key] ?? 0;
}

function normalizeItemStatsToGs(sparse: WotlkItemStatsSparse): NormalizedGsStats {
  const normalized: NormalizedGsStats = {};

  for (const [indexStr, value] of Object.entries(sparse)) {
    if (value <= 0) {
      continue;
    }

    const gsKey = WOWSIMS_INDEX_TO_GS_STAT[Number(indexStr)];
    if (!gsKey) {
      continue;
    }

    normalized[gsKey] = (normalized[gsKey] ?? 0) + value;
  }

  return normalized;
}

/** Mirrors GearScore2 `GS_GetRoleSignatureKind` (stat-only subset). */
function getRoleSignatureKind(stats: NormalizedGsStats): RoleSignature | undefined {
  const hasTank =
    statValue(stats, "DEFENSE") > 0 ||
    statValue(stats, "DODGE") > 0 ||
    statValue(stats, "PARRY") > 0 ||
    statValue(stats, "BLOCK") > 0 ||
    statValue(stats, "BLOCKVALUE") > 0;

  const hasHealer = statValue(stats, "MP5") > 0 || statValue(stats, "SPI") > 0;
  const hasCaster = statValue(stats, "SP") > 0 || statValue(stats, "INT") > 0;
  const hasPhysical =
    statValue(stats, "STR") > 0 ||
    statValue(stats, "AGI") > 0 ||
    statValue(stats, "AP") > 0 ||
    statValue(stats, "RAP") > 0 ||
    statValue(stats, "ARP") > 0 ||
    statValue(stats, "EXPERTISE") > 0;
  const hasRanged = statValue(stats, "RAP") > 0;

  if (hasTank) {
    return "TANK";
  }
  if (hasHealer && hasCaster && !hasPhysical) {
    return "HEALER";
  }
  if (hasCaster && !hasPhysical) {
    return "CASTER";
  }
  if (hasRanged) {
    return "RANGED";
  }
  if (hasPhysical) {
    return "MELEE";
  }

  return undefined;
}

function hasPhysicalPrimaryStats(stats: NormalizedGsStats): boolean {
  return (
    statValue(stats, "STR") > 0 ||
    statValue(stats, "AGI") > 0 ||
    statValue(stats, "AP") > 0 ||
    statValue(stats, "RAP") > 0
  );
}

const CASTER_HEALER_PHYSICAL_KEYS: GsStatKey[] = ["STR", "AGI", "AP", "RAP"];

function hasWeightedStat(profile: SpecStatProfile, key: GsStatKey): boolean {
  if ((profile.pve[key] ?? 0) > 0) {
    return true;
  }
  if (profile.hybridPve && (profile.hybridPve[key] ?? 0) > 0) {
    return true;
  }
  return false;
}

/** Caster/healer specs should not see loot with physical primaries they do not weight. */
function hasUnweightedPhysicalStats(
  stats: NormalizedGsStats,
  profile: SpecStatProfile,
): boolean {
  if (profile.role !== "CASTER" && profile.role !== "HEALER") {
    return false;
  }

  return CASTER_HEALER_PHYSICAL_KEYS.some(
    (key) => statValue(stats, key) > 0 && !hasWeightedStat(profile, key),
  );
}

/** Mirrors GearScore2 `GS_IsItemCompatible` stat/role checks (no slot/armor metadata). */
function isItemStatCompatible(stats: NormalizedGsStats, profile: SpecStatProfile): boolean {
  const role = profile.role;
  const allowHybridCasterItems = profile.hybridCasterItems === true;
  const roleSignature = getRoleSignatureKind(stats);

  if (
    (role === "CASTER" || role === "HEALER") &&
    statValue(stats, "STR") > 0 &&
    statValue(stats, "SP") === 0 &&
    statValue(stats, "INT") === 0
  ) {
    return false;
  }

  if (
    (role === "MELEE" || role === "RANGED") &&
    statValue(stats, "SP") > 0 &&
    !hasPhysicalPrimaryStats(stats) &&
    !allowHybridCasterItems
  ) {
    return false;
  }

  if (role === "TANK" && (roleSignature === "CASTER" || roleSignature === "HEALER")) {
    return false;
  }

  if (
    (role === "CASTER" || role === "HEALER") &&
    (roleSignature === "MELEE" || roleSignature === "RANGED") &&
    statValue(stats, "SP") === 0 &&
    statValue(stats, "INT") === 0
  ) {
    return false;
  }

  if (
    (role === "MELEE" || role === "RANGED") &&
    (roleSignature === "CASTER" || roleSignature === "HEALER") &&
    !hasPhysicalPrimaryStats(stats) &&
    !allowHybridCasterItems
  ) {
    return false;
  }

  return true;
}

function scoreItemStats(stats: NormalizedGsStats, weights: GsStatWeights): number {
  let total = 0;

  for (const [statKey, weight] of Object.entries(weights) as [GsStatKey, number][]) {
    const value = statValue(stats, statKey);
    if (value > 0) {
      total += value * weight;
    }
  }

  return total;
}

function isRoleNeutralItem(stats: NormalizedGsStats): boolean {
  return getRoleSignatureKind(stats) === undefined;
}

/**
 * Returns whether bundled item stats look useful for the spec.
 * Uses GearScore2-inspired compatibility rules plus weighted PvE stat scoring.
 */
export function isItemStatUsableForSpec(
  itemId: number,
  context: ItemStatFitContext,
  gearSlot?: number,
): boolean {
  const { className, spec } = context;
  if (!className || !spec) {
    return true;
  }

  const profile = getSpecStatProfile(className, spec);
  if (!profile) {
    return true;
  }

  if (
    profile.offHandShieldOnly === true &&
    gearSlot === GearSlotOffHand
  ) {
    const item = getWotlkItemEquipProps(itemId);
    if (item?.t === ItemTypeWeapon && item.w !== WeaponTypeShield) {
      return false;
    }
  }

  const sparseStats = getWotlkItemStats(itemId);
  if (!sparseStats) {
    return true;
  }

  const stats = normalizeItemStatsToGs(sparseStats);

  if (profile.rejectSpiritStats === true && statValue(stats, "SPI") > 0) {
    return false;
  }

  if (profile.rejectHitStats === true && statValue(stats, "HIT") > 0) {
    return false;
  }

  if (hasUnweightedPhysicalStats(stats, profile)) {
    return false;
  }

  if (!isItemStatCompatible(stats, profile)) {
    return false;
  }

  if (isRoleNeutralItem(stats)) {
    return true;
  }

  const primaryScore = scoreItemStats(stats, profile.pve);
  if (primaryScore > 0) {
    return true;
  }

  if (profile.hybridPve && scoreItemStats(stats, profile.hybridPve) > 0) {
    return true;
  }

  return false;
}
