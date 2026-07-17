import { describe, expect, it } from "vitest";
import {
  expandItemIdsWithEquivalentIdsAtSlot,
  expandItemIdsWithNameVariantsAtSlot,
  getEquivalentItemIdsAtSlot,
  getFactionVariantItemIds,
  getNameVariantItemIdsAtSlot,
  getNonListNameVariantItemIdsAtSlot,
  isItemIdOrNameVariantAtSlot,
} from "./bis-item-variants.ts";

describe("bis-item-variants", () => {
  it("links ICC normal and heroic Astrylian belt at waist slot", () => {
    expect([...getNameVariantItemIdsAtSlot(50707, 7)].sort()).toEqual([50067, 50707]);
    expect([...getNameVariantItemIdsAtSlot(50067, 7)].sort()).toEqual([50067, 50707]);
  });

  it("expands BiS heroic ids to include normal variants", () => {
    expect(expandItemIdsWithNameVariantsAtSlot([50707], 7).sort()).toEqual([50067, 50707]);
  });

  it("treats equipped normal variant as satisfying the heroic BiS target", () => {
    expect(isItemIdOrNameVariantAtSlot(50067, [50707], 7)).toBe(true);
    expect(isItemIdOrNameVariantAtSlot(50778, [50707], 7)).toBe(false);
  });

  it("returns only non-list name variants for a BiS slot", () => {
    expect(getNonListNameVariantItemIdsAtSlot([50707], 7)).toEqual([50067]);
    expect(getNonListNameVariantItemIdsAtSlot([50067, 50707], 7)).toEqual([]);
  });

  it("links ICC Solace trinkets across factions and difficulties", () => {
    expect([...getFactionVariantItemIds(47271, 12)].sort()).toEqual([
      47041, 47059, 47271, 47432,
    ]);
    expect([...getEquivalentItemIdsAtSlot(47041, 12)].sort()).toEqual([
      47041, 47059, 47271, 47432,
    ]);
    expect(expandItemIdsWithEquivalentIdsAtSlot([47041], 12).sort()).toEqual([
      47041, 47059, 47271, 47432,
    ]);
    expect(isItemIdOrNameVariantAtSlot(47271, [47059], 13)).toBe(true);
    expect(isItemIdOrNameVariantAtSlot(47271, [47059], 7)).toBe(false);
  });

  it("does not treat faction Solace pairs as name-variant BiS upgrades", () => {
    // Alliance Solace N/H share a name; Horde Fallen is faction-equivalent, not a name variant.
    expect([...getNameVariantItemIdsAtSlot(47041, 12)].sort()).toEqual([47041, 47059]);
    expect(expandItemIdsWithNameVariantsAtSlot([47059], 12).sort()).toEqual([47041, 47059]);
    expect(getNonListNameVariantItemIdsAtSlot([47059], 12)).toEqual([47041]);
    expect(getNonListNameVariantItemIdsAtSlot([47059], 12)).not.toContain(47271);
    expect(getNonListNameVariantItemIdsAtSlot([47059], 12)).not.toContain(47432);
  });
});
