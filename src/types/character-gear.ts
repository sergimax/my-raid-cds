/** One equipped item from WowSimsExporter (or compatible) gear export. */
export type CharacterGearItem = {
  /** WowSims slot index (0 = head, 1 = neck, …). */
  slot: number;
  id: number;
  enchant?: number;
  gems?: number[];
};
