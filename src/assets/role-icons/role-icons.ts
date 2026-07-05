import healerIcon from "./healer.png";
import meleeDpsIcon from "./melee-dps.png";
import rangedDpsIcon from "./ranged-dps.png";
import tankIcon from "./tank.png";
import type { ExportRoleFilterId } from "../../utils/export-spec-role.ts";

export const exportRoleIcons: Record<ExportRoleFilterId, string> = {
  tank: tankIcon,
  healer: healerIcon,
  meleeDps: meleeDpsIcon,
  rangedDps: rangedDpsIcon,
};
