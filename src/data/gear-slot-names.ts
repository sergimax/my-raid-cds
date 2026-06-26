/** WowSims gear slot index labels (0 = head, …, 16 = ranged). */
export const GearSlotNames = [
  "Head",
  "Neck",
  "Shoulder",
  "Back",
  "Chest",
  "Wrist",
  "Hands",
  "Waist",
  "Legs",
  "Feet",
  "Finger 1",
  "Finger 2",
  "Trinket 1",
  "Trinket 2",
  "Main hand",
  "Off hand",
  "Ranged",
] as const;

export function gearSlotLabel(slot: number): string {
  return GearSlotNames[slot] ?? `Slot ${slot}`;
}
