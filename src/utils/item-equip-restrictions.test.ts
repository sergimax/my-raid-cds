import { describe, expect, it } from "vitest";
import { ClassName } from "../types/characters.ts";
import {
  canEquipItemForCharacter,
  filterUsableLootItemIds,
} from "./item-equip-restrictions.ts";

describe("canEquipItemForCharacter", () => {
  it("allows all items when class is unknown", () => {
    expect(canEquipItemForCharacter(49981, 16, {})).toBe(true);
  });

  it("rejects crossbows for priests in the ranged slot", () => {
    expect(
      canEquipItemForCharacter(49981, 16, {
        className: ClassName.Priest,
        spec: "Shadow",
      }),
    ).toBe(false);
  });

  it("allows wands for priests in the ranged slot", () => {
    expect(
      canEquipItemForCharacter(50033, 16, {
        className: ClassName.Priest,
        spec: "Shadow",
      }),
    ).toBe(true);
  });

  it("allows crossbows for hunters", () => {
    expect(
      canEquipItemForCharacter(49981, 16, {
        className: ClassName.Hunter,
        spec: "Marksmanship",
      }),
    ).toBe(true);
  });

  it("allows Fury warriors to equip a 2H weapon in the off-hand", () => {
    expect(
      canEquipItemForCharacter(49623, 15, {
        className: ClassName.Warrior,
        spec: "Fury",
      }),
    ).toBe(true);
  });

  it("allows Protection warriors to dual wield one-handed weapons", () => {
    expect(
      canEquipItemForCharacter(50426, 15, {
        className: ClassName.Warrior,
        spec: "Protection",
      }),
    ).toBe(true);
  });

  it("rejects 2H off-hand weapons for Protection warriors", () => {
    expect(
      canEquipItemForCharacter(49623, 15, {
        className: ClassName.Warrior,
        spec: "Protection",
      }),
    ).toBe(false);
  });

  it("allows Enhancement shamans to dual wield one-handed weapons", () => {
    expect(
      canEquipItemForCharacter(50426, 15, {
        className: ClassName.Shaman,
        spec: "Enhancement",
      }),
    ).toBe(true);
  });

  it("rejects one-handed off-hand weapons for Elemental shamans", () => {
    expect(
      canEquipItemForCharacter(50426, 15, {
        className: ClassName.Shaman,
        spec: "Elemental",
      }),
    ).toBe(false);
  });

  it("rejects one-handed main-hand weapons for Feral druids", () => {
    expect(
      canEquipItemForCharacter(50736, 14, {
        className: ClassName.Druid,
        spec: "Feral",
      }),
    ).toBe(false);
  });

  it("allows two-handed polearm main-hand weapons for Feral druids", () => {
    expect(
      canEquipItemForCharacter(50735, 14, {
        className: ClassName.Druid,
        spec: "Feral",
      }),
    ).toBe(true);
  });

  it("rejects leather armor for Protection Warrior", () => {
    expect(
      canEquipItemForCharacter(53126, 5, {
        className: ClassName.Warrior,
        spec: "Protection",
      }),
    ).toBe(false);
  });

  it("allows plate armor for Protection Warrior", () => {
    expect(
      canEquipItemForCharacter(51225, 4, {
        className: ClassName.Warrior,
        spec: "Protection",
      }),
    ).toBe(true);
  });

  it("still allows leather armor for Fury Warrior", () => {
    expect(
      canEquipItemForCharacter(53126, 5, {
        className: ClassName.Warrior,
        spec: "Fury",
      }),
    ).toBe(true);
  });

  it("still allows neck items without armor class for Protection Paladin", () => {
    expect(
      canEquipItemForCharacter(50633, 1, {
        className: ClassName.Paladin,
        spec: "Protection",
      }),
    ).toBe(true);
  });

  it("rejects plate armor for priests", () => {
    expect(
      canEquipItemForCharacter(51197, 0, {
        className: ClassName.Priest,
        spec: "Holy",
      }),
    ).toBe(false);
  });
});

describe("filterUsableLootItemIds", () => {
  it("filters unusable ranged loot for priests", () => {
    const filtered = filterUsableLootItemIds(
      [49981, 50033],
      16,
      { className: ClassName.Priest, spec: "Shadow" },
    );
    expect(filtered).toEqual([50033]);
  });
});
