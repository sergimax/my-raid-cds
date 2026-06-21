import { describe, expect, it } from "vitest";
import { MAX_CHARACTER_NAME_LENGTH } from "../constants/character.ts";
import { Classes } from "../types/characters.ts";
import { parseCharacterForm } from "./validate-character.ts";
import { createTestCharacter } from "../test/fixtures.ts";

describe("parseCharacterForm", () => {
  it("rejects missing name or class", () => {
    expect(
      parseCharacterForm({ name: "", characterClass: "" }, []),
    ).toEqual({
      ok: false,
      error: "Enter a name and choose a class.",
    });
  });

  it("rejects names over max length", () => {
    const longName = "a".repeat(MAX_CHARACTER_NAME_LENGTH + 1);
    expect(
      parseCharacterForm(
        { name: longName, characterClass: Classes[0] },
        [],
      ),
    ).toEqual({
      ok: false,
      error: `Character name must be at most ${MAX_CHARACTER_NAME_LENGTH} characters.`,
    });
  });

  it("rejects duplicate name and class case-insensitively", () => {
    const existing = createTestCharacter({
      name: "Alpha",
      class: Classes[1],
    });
    expect(
      parseCharacterForm(
        { name: "  alpha  ", characterClass: Classes[1] },
        [existing],
      ),
    ).toEqual({
      ok: false,
      error: "A character with this name and class already exists.",
    });
  });

  it("accepts valid input with trimmed name", () => {
    const result = parseCharacterForm(
      { name: "  Beta  ", characterClass: Classes[2] },
      [],
    );
    expect(result).toEqual({
      ok: true,
      name: "Beta",
      characterClass: Classes[2],
    });
  });
});
