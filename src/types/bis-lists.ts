import type { ClassName } from "./characters.ts";

/** One gear slot target in a BiS list (WowSims slot index 0–16). */
export type BisListSlot = {
  slot: number;
  itemIds: number[];
};

export type BisListPreset = {
  id: string;
  name: string;
  slots: BisListSlot[];
};

export type BuiltInSpecBis = {
  className: ClassName;
  spec: string;
  presets: BisListPreset[];
};

export type LocalSpecBisEntry = {
  selectedPresetId: string;
  presets: BisListPreset[];
};

export type LocalBisListsState = {
  schemaVersion: 1;
  entries: Record<string, LocalSpecBisEntry>;
};
