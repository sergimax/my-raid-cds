import { describe, expect, it } from "vitest";
import { unholyDeathKnightBis } from "../data/bis-presets/unholy-death-knight.ts";
import { ClassName } from "../types/characters.ts";
import {
  collectSlotValidationErrors,
  createEmptySlotDrafts,
  isSlotDraftDirty,
  isSlotEditing,
  presetToSlotDrafts,
} from "./bis-list-editor.ts";

describe("presetToSlotDrafts", () => {
  it("maps preset slots to confirmed drafts", () => {
    const drafts = presetToSlotDrafts(unholyDeathKnightBis.presets[0]!);
    const headDraft = drafts.find((draft) => draft.slot === 0);

    expect(headDraft?.itemIds).toEqual([51312]);
    expect(headDraft?.itemsText).toBe(headDraft?.confirmedText);
  });
});

describe("createEmptySlotDrafts", () => {
  it("creates one draft per gear slot", () => {
    const drafts = createEmptySlotDrafts();
    expect(drafts.length).toBeGreaterThan(0);
    expect(drafts.every((draft) => draft.itemsText === "")).toBe(true);
  });
});

describe("isSlotDraftDirty", () => {
  it("detects unconfirmed text changes", () => {
    expect(
      isSlotDraftDirty({
        slot: 0,
        itemsText: "51312",
        confirmedText: "Sanctified Scourgelord Helmet",
        itemIds: [51312],
      }),
    ).toBe(true);
  });
});

describe("isSlotEditing", () => {
  const slotDraft = {
    slot: 0,
    itemsText: "51312",
    confirmedText: "51312",
    itemIds: [51312],
  };

  it("returns false for built-in presets", () => {
    expect(isSlotEditing(slotDraft, {}, true)).toBe(false);
  });

  it("returns true when the slot is explicitly being edited", () => {
    expect(isSlotEditing(slotDraft, { 0: true }, false)).toBe(true);
  });
});

describe("collectSlotValidationErrors", () => {
  it("reports wrong-slot items on strict validation", () => {
    const drafts = presetToSlotDrafts(unholyDeathKnightBis.presets[0]!);
    const headDraft = drafts.find((draft) => draft.slot === 0);
    if (!headDraft) {
      throw new Error("missing head draft");
    }

    const errors = collectSlotValidationErrors(
      [{ ...headDraft, itemsText: "51132" }],
      "strict",
      { className: ClassName.DeathKnight, spec: "Unholy" },
    );

    expect(errors[0]).toContain("Hands");
  });
});
