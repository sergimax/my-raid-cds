import { describe, expect, it } from "vitest";
import { Classes } from "../types/characters.ts";
import { formatCharacterImportLabel } from "./format-character-import.ts";
import { createTestCharacter } from "../test/fixtures.ts";

describe("formatCharacterImportLabel", () => {
  it("returns name only when no specs are set", () => {
    expect(formatCharacterImportLabel(createTestCharacter({ name: "Elst" }))).toBe(
      "Elst",
    );
  });

  it("includes main spec short name and gear score", () => {
    expect(
      formatCharacterImportLabel(
        createTestCharacter({
          name: "Elst",
          class: Classes[0],
          mainSpec: { spec: "Unholy", gearScore: 6615 },
        }),
      ),
    ).toBe("Elst Unh 6.6k");
  });

  it("joins main and off spec with backslash separator", () => {
    expect(
      formatCharacterImportLabel(
        createTestCharacter({
          name: "Elst",
          class: Classes[0],
          mainSpec: { spec: "Unholy", gearScore: 6615 },
          offSpec: { spec: "Blood", gearScore: 6023 },
        }),
      ),
    ).toBe("Elst Unh 6.6k \\ Blo 6k");
  });

  it("omits gear score when not set", () => {
    expect(
      formatCharacterImportLabel(
        createTestCharacter({
          name: "Elst",
          mainSpec: { spec: "Unholy" },
          offSpec: { spec: "Blood", gearScore: 6023 },
        }),
      ),
    ).toBe("Elst Unh \\ Blo 6k");
  });
});
