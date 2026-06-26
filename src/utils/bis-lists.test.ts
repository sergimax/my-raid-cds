import { describe, expect, it } from "vitest";
import { ClassName } from "../types/characters.ts";
import { unholyDeathKnightBis } from "../data/bis-presets/unholy-death-knight.ts";
import {
  buildBisSlotMap,
  getSelectedPresetForSpec,
  resolveItemNamesToIds,
  specBisStorageKey,
} from "./bis-lists.ts";

describe("buildBisSlotMap", () => {
  it("maps preset slots to item id lists", () => {
    const slotMap = buildBisSlotMap(unholyDeathKnightBis.presets[0]);
    expect(slotMap.get(1)).toContain(54581);
    expect(slotMap.get(14)).toContain(49623);
    expect(slotMap.get(16)).toEqual([50459, 47673]);
  });
});

describe("resolveItemNamesToIds", () => {
  it("resolves English item names and alternatives", () => {
    const resolved = resolveItemNamesToIds(
      "Sigil of the Hanged Man / Sigil of Virulence",
    );
    expect(resolved.unknownNames).toEqual([]);
    expect(resolved.itemIds).toEqual([50459, 47673]);
  });
});

describe("getSelectedPresetForSpec", () => {
  it("uses the saved preset id when present", () => {
    const storageKey = specBisStorageKey(ClassName.DeathKnight, "Unholy");
    const selected = getSelectedPresetForSpec(ClassName.DeathKnight, "Unholy", {
      schemaVersion: 1,
      entries: {
        [storageKey]: {
          selectedPresetId: "default",
          presets: [],
        },
      },
    });

    expect(selected?.id).toBe("default");
    expect(selected?.slots.some((slot) => slot.itemIds.includes(54581))).toBe(
      true,
    );
  });
});
