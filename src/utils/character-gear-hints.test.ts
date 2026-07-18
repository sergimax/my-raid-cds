import { describe, expect, it } from "vitest";
import { ClassName, Classes } from "../types/characters.ts";
import { DungeonDifficulty } from "../types/dungeons.ts";
import { unholyDeathKnightBis } from "../data/bis-presets/unholy-death-knight.ts";
import { buildBisSlotMap } from "./bis-lists.ts";
import {
  evaluateCharacterGearHints,
  evaluateCharacterGearHintTints,
  hasAnyGearHint,
  type CharacterGearHints,
} from "./character-gear-hints.ts";
import { getGearHintCellDisplay } from "./gear-upgrade-hint.ts";
import { createTestCharacter, createTestDungeon } from "../test/fixtures.ts";

const emptyTrack = {
  level: 0 as const,
  upgradeSlotCount: 0,
  upgradeSlots: [],
};

const icc25Heroic = createTestDungeon({
  name: "Icecrown Citadel",
  raidKey: "icecrownCitadel",
  size: 25,
  difficulty: DungeonDifficulty.HEROIC,
  itemLevel: [264, 271, 277, 284],
});

const deathKnightClass = Classes.find(
  (characterClass) => characterClass.name === ClassName.DeathKnight,
)!;

const unholyBisSlotMap = buildBisSlotMap(unholyDeathKnightBis.presets[0]!);

function getUnholyBisSlotMap(className: ClassName, spec: string) {
  if (className === ClassName.DeathKnight && spec === "Unholy") {
    return unholyBisSlotMap;
  }
  return new Map();
}

describe("hasAnyGearHint", () => {
  it("returns false for empty hints", () => {
    expect(hasAnyGearHint({})).toBe(false);
  });

  it("returns true when a BiS track is active", () => {
    expect(
      hasAnyGearHint({
        main: {
          specGear: { spec: "Unholy" },
          gearHint: {
            bis: { level: 1, upgradeSlotCount: 1, upgradeSlots: [{ slot: 1 }] },
            bisVariant: emptyTrack,
            ilvl: emptyTrack,
            equippedCount: 8,
            peakDungeonItemLevel: 284,
            slotAware: true,
            bisListActive: true,
          },
          tierSetHint: { tokenNeeds: [] },
          bisBossLootGroups: [],
          bisVariantBossLootGroups: [],
          ilvlBossLootGroups: [],
        },
      }),
    ).toBe(true);
  });

  it("counts tier tokens toward hasAnyGearHint without a cell tint", () => {
    const hints: CharacterGearHints = {
      main: {
        specGear: { spec: "Unholy" },
        gearHint: {
          bis: emptyTrack,
          bisVariant: emptyTrack,
          ilvl: emptyTrack,
          equippedCount: 4,
          peakDungeonItemLevel: 284,
          slotAware: true,
          bisListActive: true,
        },
        tierSetHint: {
          tokenNeeds: [{ tokenItemId: 52028, slot: 0, targetItemId: 51127 }],
        },
        bisBossLootGroups: [],
        bisVariantBossLootGroups: [],
        ilvlBossLootGroups: [],
      },
    };

    expect(hasAnyGearHint(hints)).toBe(true);
    expect(getGearHintCellDisplay(hints.main!.gearHint)).toBeNull();
  });
});

describe("evaluateCharacterGearHintTints", () => {
  it("skips boss loot grouping on the tint path", () => {
    const tints = evaluateCharacterGearHintTints(
      createTestCharacter({
        class: deathKnightClass,
        mainSpec: { spec: "Unholy", gearItems: [{ slot: 1, id: 37646 }] },
      }),
      icc25Heroic,
      getUnholyBisSlotMap,
    );

    expect(tints.main?.gearHint).toBeDefined();
    expect(tints.main).not.toHaveProperty("bisBossLootGroups");
  });
});

describe("evaluateCharacterGearHints", () => {
  it("returns empty hints when the character has no class", () => {
    expect(
      evaluateCharacterGearHints(
        createTestCharacter({ class: undefined }),
        icc25Heroic,
        getUnholyBisSlotMap,
        "en",
      ),
    ).toEqual({});
  });

  it("evaluates main and off specs independently", () => {
    const hints = evaluateCharacterGearHints(
      createTestCharacter({
        class: deathKnightClass,
        mainSpec: { spec: "Unholy" },
        offSpec: { spec: "Blood" },
      }),
      icc25Heroic,
      getUnholyBisSlotMap,
      "en",
    );

    expect(hints.main?.specGear.spec).toBe("Unholy");
    expect(hints.off?.specGear.spec).toBe("Blood");
  });
});
