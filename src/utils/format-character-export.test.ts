import { describe, expect, it } from "vitest";
import { Classes } from "../types/characters.ts";
import {
  defaultExportSpecSelection,
  formatCharacterExportLabel,
  isCharacterIncludedInExport,
} from "./format-character-export.ts";
import { createTestCharacter } from "../test/fixtures.ts";

const mainOnlySelection = {
  includeMain: true,
  includeOff: false,
  includeWithoutSpec: true,
};

describe("formatCharacterExportLabel", () => {
  it("returns name only when no specs are set", () => {
    expect(formatCharacterExportLabel(createTestCharacter({ name: "Elst" }))).toBe(
      "Elst",
    );
  });

  it("excludes name-only characters when includeWithoutSpec is false", () => {
    expect(
      formatCharacterExportLabel(createTestCharacter({ name: "Elst" }), {
        includeMain: false,
        includeOff: false,
        includeWithoutSpec: false,
      }),
    ).toBeNull();
  });

  it("uses short spec names and gear score without k suffix", () => {
    expect(
      formatCharacterExportLabel(
        createTestCharacter({
          name: "Elst",
          class: Classes[0],
          mainSpec: { spec: "Unholy", gearScore: 6615 },
        }),
      ),
    ).toBe("Elst: Udk 6.6");
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
        includeWithoutSpec: true,
      }),
    ).toBe("Elst: Udk 6.6");
    expect(
      formatCharacterExportLabel(character, {
        includeMain: false,
        includeOff: true,
        includeWithoutSpec: true,
      }),
    ).toBe("Elst: Blood 6");
    expect(
      formatCharacterExportLabel(character, {
        includeMain: true,
        includeOff: true,
        includeWithoutSpec: true,
      }),
    ).toBe("Elst: Udk 6.6, Blood 6");
    expect(
      formatCharacterExportLabel(character, {
        includeMain: false,
        includeOff: false,
        includeWithoutSpec: true,
      }),
    ).toBeNull();
  });

  it("defaults to off when only off spec is set", () => {
    expect(defaultExportSpecSelection({ offSpec: { spec: "Blood" } })).toEqual({
      includeMain: false,
      includeOff: true,
      includeWithoutSpec: true,
    });
    expect(
      isCharacterIncludedInExport(
        { mainSpec: undefined, offSpec: { spec: "Blood" } },
        { includeMain: false, includeOff: true, includeWithoutSpec: true },
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
        mainOnlySelection,
      ),
    ).toBe("Elst: Udk");
  });

  it("omits specs below the minimum gear score filter", () => {
    const character = createTestCharacter({
      name: "Elst",
      class: Classes[0],
      mainSpec: { spec: "Unholy", gearScore: 6615 },
      offSpec: { spec: "Blood", gearScore: 6023 },
    });

    expect(
      formatCharacterExportLabel(
        character,
        {
          includeMain: true,
          includeOff: true,
          includeWithoutSpec: true,
        },
        "en",
        6500,
      ),
    ).toBe("Elst: Udk 6.6");
    expect(
      formatCharacterExportLabel(
        character,
        {
          includeMain: true,
          includeOff: true,
          includeWithoutSpec: true,
        },
        "en",
        6700,
      ),
    ).toBeNull();
  });

  it("keeps specs without gear score when a minimum is set", () => {
    expect(
      formatCharacterExportLabel(
        createTestCharacter({
          name: "Elst",
          class: Classes[0],
          mainSpec: { spec: "Unholy" },
        }),
        mainOnlySelection,
        "en",
        6500,
      ),
    ).toBe("Elst: Udk");
  });
});
