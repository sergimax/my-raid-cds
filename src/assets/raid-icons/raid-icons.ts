import type { RaidKey } from "../../data/raid-names.ts";
import { resolveDungeonRaidKey } from "../../utils/resolve-dungeon-raid-key.ts";
import type { DungeonRecord } from "../../types/dungeons.ts";
import icecrownCitadelIcon from "./icecrown-citadel.png";
import naxxramasIcon from "./naxxramas.png";
import obsidianSanctumIcon from "./obsidian-sanctum.png";
import onyxiasLairIcon from "./onyxias-lair.png";
import rubySanctumIcon from "./ruby-sanctum.png";
import trialOfTheCrusaderIcon from "./trial-of-the-crusader.png";
import ulduarIcon from "./ulduar.png";
import vaultOfArchavonIcon from "./vault-of-archavon.png";

export const raidIcons: Record<RaidKey, string> = {
  naxxramas: naxxramasIcon,
  obsidianSanctum: obsidianSanctumIcon,
  onyxiasLair: onyxiasLairIcon,
  vaultOfArchavon: vaultOfArchavonIcon,
  trialOfTheCrusader: trialOfTheCrusaderIcon,
  ulduar: ulduarIcon,
  icecrownCitadel: icecrownCitadelIcon,
  rubySanctum: rubySanctumIcon,
};

export function getRaidIcon(raidKey: RaidKey | undefined): string | undefined {
  return raidKey ? raidIcons[raidKey] : undefined;
}

export function getDungeonRaidIcon(
  dungeon: Pick<DungeonRecord, "name" | "raidKey">,
): string | undefined {
  return getRaidIcon(resolveDungeonRaidKey(dungeon));
}
