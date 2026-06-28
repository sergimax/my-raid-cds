import { describe, expect, it } from "vitest";
import { ClassName } from "../types/characters.ts";
import { isItemStatUsableForSpec } from "./item-stat-fit.ts";

describe("isItemStatUsableForSpec", () => {
  it("allows neutral stamina-only gear", () => {
    expect(
      isItemStatUsableForSpec(15058, {
        className: ClassName.Shaman,
        spec: "Enhancement",
      }),
    ).toBe(true);
  });

  it("allows Agi+AP cross-armor BiS for Retribution Paladin via AP weighting", () => {
    expect(
      isItemStatUsableForSpec(50653, {
        className: ClassName.Paladin,
        spec: "Retribution",
      }),
    ).toBe(true);
  });

  it("allows Agi+AP cross-armor BiS for Fury Warrior via AP weighting", () => {
    expect(
      isItemStatUsableForSpec(54580, {
        className: ClassName.Warrior,
        spec: "Fury",
      }),
    ).toBe(true);
  });

  it("allows caster mail for Enhancement Shaman (Agi or spellhance Int builds)", () => {
    expect(
      isItemStatUsableForSpec(40995, {
        className: ClassName.Shaman,
        spec: "Enhancement",
      }),
    ).toBe(true);
  });

  it("allows the same caster mail for Elemental Shaman", () => {
    expect(
      isItemStatUsableForSpec(40995, {
        className: ClassName.Shaman,
        spec: "Elemental",
      }),
    ).toBe(true);
  });

  it("rejects intellect plate for Fury Warrior", () => {
    expect(
      isItemStatUsableForSpec(37182, {
        className: ClassName.Warrior,
        spec: "Fury",
      }),
    ).toBe(false);
  });

  it("allows strength plate for Fury Warrior", () => {
    expect(
      isItemStatUsableForSpec(51225, {
        className: ClassName.Warrior,
        spec: "Fury",
      }),
    ).toBe(true);
  });

  it("passes through when class or spec is missing", () => {
    expect(isItemStatUsableForSpec(40995, {})).toBe(true);
  });
});
