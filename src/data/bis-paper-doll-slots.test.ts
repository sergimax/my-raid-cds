import { describe, expect, it } from "vitest";
import {
  BIS_PAPER_DOLL_BOTTOM_SLOTS,
  BIS_PAPER_DOLL_LEFT_ROWS,
  BIS_PAPER_DOLL_RIGHT_ROWS,
  getBisPaperDollArmorPairs,
} from "./bis-paper-doll-slots.ts";

describe("bis paper-doll slot layout", () => {
  it("places armor columns and weapon row like the character pane", () => {
    expect(
      BIS_PAPER_DOLL_LEFT_ROWS.filter((row) => row.kind === "gear").map(
        (row) => row.slot,
      ),
    ).toEqual([0, 1, 2, 3, 4, 5]);
    expect(
      BIS_PAPER_DOLL_LEFT_ROWS.filter((row) => row.kind === "cosmetic").map(
        (row) => row.id,
      ),
    ).toEqual(["shirt", "tabard"]);
    expect(
      BIS_PAPER_DOLL_RIGHT_ROWS.map((row) =>
        row.kind === "gear" ? row.slot : row.id,
      ),
    ).toEqual([6, 7, 8, 9, 10, 11, 12, 13]);
    expect(BIS_PAPER_DOLL_BOTTOM_SLOTS).toEqual([14, 15, 16]);
  });

  it("covers every WowSims BiS slot exactly once", () => {
    const gearSlots = [
      ...BIS_PAPER_DOLL_LEFT_ROWS,
      ...BIS_PAPER_DOLL_RIGHT_ROWS,
    ]
      .filter((row) => row.kind === "gear")
      .map((row) => row.slot)
      .concat([...BIS_PAPER_DOLL_BOTTOM_SLOTS]);

    expect([...gearSlots].sort((left, right) => left - right)).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
    ]);
  });

  it("pairs left and right armor rows for table layout", () => {
    const pairs = getBisPaperDollArmorPairs();
    expect(pairs).toHaveLength(8);
    expect(pairs[0]).toEqual({
      left: { kind: "gear", slot: 0 },
      right: { kind: "gear", slot: 6 },
    });
    expect(pairs[5]).toEqual({
      left: { kind: "cosmetic", id: "shirt" },
      right: { kind: "gear", slot: 11 },
    });
    expect(pairs[7]).toEqual({
      left: { kind: "gear", slot: 5 },
      right: { kind: "gear", slot: 13 },
    });
  });
});
