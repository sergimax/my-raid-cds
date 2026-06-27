import { describe, expect, it } from "vitest";
import { unholyDeathKnightBis } from "../data/bis-presets/unholy-death-knight.ts";
import { DungeonDifficulty } from "../types/dungeons.ts";
import { buildBisSlotMap } from "./bis-lists.ts";
import {
  aggregateTierSetTokenNeeds,
  evaluateTierSetHint,
} from "./tier-set-hint.ts";

describe("evaluateTierSetHint", () => {
  const icc25Heroic = {
    name: "Icecrown Citadel",
    raidKey: "icecrownCitadel" as const,
    size: 25 as const,
    difficulty: DungeonDifficulty.HEROIC,
  };

  const icc10Heroic = {
    name: "Icecrown Citadel",
    raidKey: "icecrownCitadel" as const,
    size: 10 as const,
    difficulty: DungeonDifficulty.HEROIC,
  };

  const rubySanctum25Heroic = {
    name: "Ruby Sanctum",
    raidKey: "rubySanctum" as const,
    size: 25 as const,
    difficulty: DungeonDifficulty.HEROIC,
  };

  const unholyBis = buildBisSlotMap(unholyDeathKnightBis.presets[0]);

  it("returns no tokens when BiS map is empty", () => {
    expect(
      evaluateTierSetHint([{ slot: 0, id: 50096 }], icc25Heroic, new Map()),
    ).toEqual({ tokenNeeds: [] });
  });

  it("counts heroic sanctification tokens for BiS 277 pieces on ICC 25H", () => {
    const hint = evaluateTierSetHint(
      [
        { slot: 0, id: 51127 },
        { slot: 2, id: 51125 },
        { slot: 4, id: 51129 },
        { slot: 6, id: 51128 },
      ],
      icc25Heroic,
      unholyBis,
    );

    expect(hint.tokenNeeds).toHaveLength(4);
    expect(hint.tokenNeeds.every((need) => need.tokenItemId === 52030)).toBe(
      true,
    );
  });

  it("does not show tokens on Ruby Sanctum rows", () => {
    const hint = evaluateTierSetHint(
      [
        { slot: 0, id: 51127 },
        { slot: 2, id: 51125 },
        { slot: 4, id: 51129 },
        { slot: 6, id: 51128 },
      ],
      rubySanctum25Heroic,
      unholyBis,
    );

    expect(hint.tokenNeeds).toEqual([]);
  });

  it("counts normal sanctification tokens on ICC 10H when BiS targets 264", () => {
    const bisSlotMap = new Map<number, readonly number[]>([[0, [51127]]]);

    const hint = evaluateTierSetHint(
      [{ slot: 0, id: 50096 }],
      icc10Heroic,
      bisSlotMap,
    );

    expect(hint.tokenNeeds).toEqual([
      {
        tokenItemId: 52005,
        slot: 0,
        targetItemId: 51127,
      },
    ]);
  });

  it("shows droppable tokens when gear is not imported", () => {
    const hint = evaluateTierSetHint(undefined, icc25Heroic, unholyBis);

    expect(hint.tokenNeeds.length).toBeGreaterThan(0);
    expect(hint.tokenNeeds[0]?.tokenItemId).toBe(52005);
  });

  it("does not show tokens when gear is not imported for non-token raids", () => {
    const hint = evaluateTierSetHint(undefined, rubySanctum25Heroic, unholyBis);

    expect(hint.tokenNeeds).toEqual([]);
  });

  it("skips tokens when equipped item already matches BiS target id", () => {
    const bisSlotMap = new Map<number, readonly number[]>([[0, [51312]]]);

    const hint = evaluateTierSetHint(
      [{ slot: 0, id: 51312 }],
      icc25Heroic,
      bisSlotMap,
    );

    expect(hint.tokenNeeds).toEqual([]);
  });

  it("shows heroic and normal marks for mixed 264/251 set progress on ICC 25H", () => {
    const hint = evaluateTierSetHint(
      [
        { slot: 0, id: 51127 },
        { slot: 2, id: 51125 },
        { slot: 4, id: 51129 },
        { slot: 6, id: 50095 },
      ],
      icc25Heroic,
      unholyBis,
    );

    const aggregated = aggregateTierSetTokenNeeds(hint.tokenNeeds);
    expect(aggregated).toEqual([
      { tokenItemId: 52005, count: 1, slots: [6] },
      { tokenItemId: 52030, count: 3, slots: [0, 2, 4] },
    ]);
  });

  it("resolves ICC rows by localized raid name when raidKey is missing", () => {
    const hint = evaluateTierSetHint(
      [
        { slot: 0, id: 51127 },
        { slot: 2, id: 51125 },
        { slot: 4, id: 51129 },
        { slot: 6, id: 51128 },
      ],
      {
        name: "Цитадель Ледяной Короны",
        size: 25,
        difficulty: DungeonDifficulty.HEROIC,
      },
      unholyBis,
    );

    expect(hint.tokenNeeds).toHaveLength(4);
    expect(hint.tokenNeeds.every((need) => need.tokenItemId === 52030)).toBe(
      true,
    );
  });

  it("shows the next droppable token when an off-set item below BiS tier is equipped", () => {
    const bisSlotMap = new Map<number, readonly number[]>([[0, [51312]]]);

    const hint = evaluateTierSetHint(
      [{ slot: 0, id: 51127 }],
      icc25Heroic,
      bisSlotMap,
    );

    expect(hint.tokenNeeds).toHaveLength(1);
    expect(hint.tokenNeeds[0]?.tokenItemId).toBe(52030);
  });
});

describe("aggregateTierSetTokenNeeds", () => {
  it("groups token needs by token item id", () => {
    const aggregated = aggregateTierSetTokenNeeds([
      { tokenItemId: 52030, slot: 0, targetItemId: 51312 },
      { tokenItemId: 52030, slot: 2, targetItemId: 51314 },
      { tokenItemId: 52005, slot: 4, targetItemId: 51129 },
    ]);

    expect(aggregated).toEqual([
      { tokenItemId: 52005, count: 1, slots: [4] },
      { tokenItemId: 52030, count: 2, slots: [0, 2] },
    ]);
  });
});
