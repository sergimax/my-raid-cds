/** ICC / ToC token category for tier set upgrades. */
export type TierSetTokenType = "vanquisher" | "protector" | "conqueror";

export type TierSetTier = "t8" | "t9" | "t10";

/** One tier set gear piece (bundled lookup by item id). */
export type TierSetItemEntry = {
  setName: string;
  slot: number;
  itemLevel: number;
  tier: TierSetTier;
  /** 1 = base vendor/drop, 2 = first token upgrade, 3 = heroic token upgrade. */
  step: 1 | 2 | 3;
  /** ICC / ToC token category; absent for vendor-only or unknown sets. */
  tokenType?: TierSetTokenType;
  /** Item id for the previous upgrade step in the same set slot, when any. */
  prevItemId?: number;
  /** Token consumed to upgrade from the previous step to this piece. */
  tokenItemId?: number;
};

export type TierSetTokenDropSource = {
  raidKey: string;
  size: 10 | 25;
  difficulty: "Normal" | "Heroic";
};

/** Tier set upgrade token (not always present in bundled item names). */
export type TierSetTokenDefinition = {
  itemId: number;
  tokenType: TierSetTokenType;
  tier: TierSetTier;
  heroic: boolean;
  names: { en: string; ru: string };
  dropsFrom: readonly TierSetTokenDropSource[];
};

export type TierSetTokenNeed = {
  tokenItemId: number;
  slot: number;
  targetItemId: number;
};

export type TierSetHint = {
  tokenNeeds: TierSetTokenNeed[];
};
