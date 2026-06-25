import { describe, expect, it } from "vitest";
import { Classes } from "../types/characters.ts";
import {
  defaultExportSpecSelection,
  formatCharacterExportLabel,
  isCharacterIncludedInExport,
} from "./format-character-export.ts";
import { createTestCharacter } from "../test/fixtures.ts";

describe("formatCharacterExportLabel", () => {
  it("returns name only when no specs are set", () => {
    expect(formatCharacterExportLabel(createTestCharacter({ name: "Elst" }))).toBe(
      "Elst",
    );
  });

  it("includes main spec short name and gear score by default", () => {
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

  it("exports one or both specs based on selection", () => {
    const character = createTestCharacter({
      name: "Elst",
      class: Classes[0],
      mainSpec: { spec: "Unholy", gearScore: 6615 },
      offSpec: { spec: "Blood", gearScore: 6023 },
    });
    expect(
      formatCharacterExportLabel(character, {
        includeMain: true,
        includeOff: false,
      }),
    ).toBe("Elst Udk 6.6k");
    expect(
      formatCharacterExportLabel(character, {
        includeMain: false,
        includeOff: true,
      }),
    ).toBe("Elst Blood 6k");
    expect(
      formatCharacterExportLabel(character, {
        includeMain: true,
        includeOff: true,
      }),
    ).toBe("Elst Udk 6.6k \\ Blood 6k");
    expect(
      formatCharacterExportLabel(character, {
        includeMain: false,
        includeOff: false,
      }),
    ).toBeNull();
  });

  it("defaults to off when only off spec is set", () => {
    expect(defaultExportSpecSelection({ offSpec: { spec: "Blood" } })).toEqual({
      includeMain: false,
      includeOff: true,
    });
    expect(
      isCharacterIncludedInExport(
        { mainSpec: undefined, offSpec: { spec: "Blood" } },
        { includeMain: false, includeOff: true },
      ),
    ).toBe(true);
  });

  it("omits gear score when not set", () => {
    expect(
      formatCharacterExportLabel(
        createTestCharacter({
          name: "Elst",
          class: Classes[0],
          mainSpec: { spec: "Unholy" },
        }),
        { includeMain: true, includeOff: false },
      ),
    ).toBe("Elst Udk");
  });
});
