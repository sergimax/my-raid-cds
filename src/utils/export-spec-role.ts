import type { SpecRole } from "../data/spec-stat-priorities.ts";
import { getSpecStatProfile } from "../data/spec-stat-priorities.ts";
import type { ClassName } from "../types/characters.ts";

/** Export panel role buckets (tank / healer / melee DPS / ranged DPS). */
export type ExportRoleFilterId = "tank" | "healer" | "meleeDps" | "rangedDps";

export const EXPORT_ROLE_FILTER_IDS: readonly ExportRoleFilterId[] = [
  "tank",
  "healer",
  "meleeDps",
  "rangedDps",
] as const;

export type ExportRoleFilter = Record<ExportRoleFilterId, boolean>;

export const DEFAULT_EXPORT_ROLE_FILTER: ExportRoleFilter = {
  tank: true,
  healer: true,
  meleeDps: true,
  rangedDps: true,
};

function specRoleToExportRole(role: SpecRole): ExportRoleFilterId {
  switch (role) {
    case "TANK":
      return "tank";
    case "HEALER":
      return "healer";
    case "MELEE":
      return "meleeDps";
    case "RANGED":
    case "CASTER":
      return "rangedDps";
  }
}

export function getExportRoleForSpec(
  className: ClassName,
  spec: string,
): ExportRoleFilterId | undefined {
  const profile = getSpecStatProfile(className, spec);
  if (!profile) {
    return undefined;
  }
  return specRoleToExportRole(profile.role);
}

export function specPassesExportRoleFilter(
  className: ClassName | undefined,
  spec: string,
  roleFilter: ExportRoleFilter = DEFAULT_EXPORT_ROLE_FILTER,
): boolean {
  if (!className) {
    return true;
  }

  const exportRole = getExportRoleForSpec(className, spec);
  if (!exportRole) {
    return true;
  }

  const activeRoleFilter = roleFilter ?? DEFAULT_EXPORT_ROLE_FILTER;
  return activeRoleFilter[exportRole];
}
