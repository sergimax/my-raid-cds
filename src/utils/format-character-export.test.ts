import { describe, expect, it } from "vitest";
import { Classes } from "../types/characters.ts";
import { formatCharacterExportLabel } from "./format-character-export.ts";
import { createTestCharacter } from "../test/fixtures.ts";

describe("formatCharacterExportLabel", () => {
  it("returns name only when no specs are set", () => {
    expect(formatCharacterExportLabel(createTestCharacter({ name: "Elst" }))).toBe(
      "Elst",
    );
  });

  it("includes main spec short name and gear score", () => {
    expect(
      formatCharacterExportLabel(
        createTestCharacter({
          name: "Elst",
          class: Classes[0],
          mainSpec: { spec: "Unholy", gearScore: 6615 },
        }),
      ),
    ).toBe("Elst Udk 6.6k");
  });

  it("joins main and off spec with backslash separator", () => {
    expect(
      formatCharacterExportLabel(
        createTestCharacter({
          name: "Elst",
          class: Classes[0],
          mainSpec: { spec: "Unholy", gearScore: 6615 },
          offSpec: { spec: "Blood", gearScore: 6023 },
        }),
      ),
    ).toBe("Elst Udk 6.6k \\ Blood 6k");
  });

  it("omits gear score when not set", () => {
    expect(
      formatCharacterExportLabel(
        createTestCharacter({
          name: "Elst",
          class: Classes[0],
          mainSpec: { spec: "Unholy" },
          offSpec: { spec: "Blood", gearScore: 6023 },
        }),
      ),
    ).toBe("Elst Udk \\ Blood 6k");
  });
});
