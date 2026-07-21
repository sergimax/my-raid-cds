/**
 * In-game paper-doll order for BiS slot UI (WowSims indices 0–16).
 * Shirt/tabard are cosmetic-only placeholders (not stored in BiS data).
 */

export type BisPaperDollCosmeticId = "shirt" | "tabard";

export type BisPaperDollRow =
  | { kind: "gear"; slot: number }
  | { kind: "cosmetic"; id: BisPaperDollCosmeticId };

/** Left column: head → neck → shoulder → back → chest → shirt → tabard → wrist. */
export const BIS_PAPER_DOLL_LEFT_ROWS: readonly BisPaperDollRow[] = [
  { kind: "gear", slot: 0 },
  { kind: "gear", slot: 1 },
  { kind: "gear", slot: 2 },
  { kind: "gear", slot: 3 },
  { kind: "gear", slot: 4 },
  { kind: "cosmetic", id: "shirt" },
  { kind: "cosmetic", id: "tabard" },
  { kind: "gear", slot: 5 },
];

/** Right column: hands → waist → legs → feet → rings → trinkets. */
export const BIS_PAPER_DOLL_RIGHT_ROWS: readonly BisPaperDollRow[] = [
  { kind: "gear", slot: 6 },
  { kind: "gear", slot: 7 },
  { kind: "gear", slot: 8 },
  { kind: "gear", slot: 9 },
  { kind: "gear", slot: 10 },
  { kind: "gear", slot: 11 },
  { kind: "gear", slot: 12 },
  { kind: "gear", slot: 13 },
];

/** Bottom row: main hand, off hand, ranged/special (relic / wand / ranged weapon). */
export const BIS_PAPER_DOLL_BOTTOM_SLOTS: readonly number[] = [14, 15, 16];
