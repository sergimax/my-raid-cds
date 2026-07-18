import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { unholyDeathKnightBis } from "../data/bis-presets/unholy-death-knight.ts";
import {
  BIS_LISTS_SCHEMA_VERSION,
  BIS_LISTS_STORAGE_KEY,
} from "../storage/bis-lists/constants.ts";
import { ClassName } from "../types/characters.ts";
import { specBisStorageKey } from "../utils/bis-lists.ts";
import {
  BIS_LISTS_SAVE_DEBOUNCE_MS,
  useBisListsDomain,
} from "./use-bis-lists-domain.ts";

const builtInPresetId = unholyDeathKnightBis.presets[0]!.id;
const storageKey = specBisStorageKey(ClassName.DeathKnight, "Unholy");

function readPersistedBisLists() {
  const raw = localStorage.getItem(BIS_LISTS_STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

function flushBisListsSave() {
  act(() => {
    vi.advanceTimersByTime(BIS_LISTS_SAVE_DEBOUNCE_MS);
  });
}

describe("useBisListsDomain", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("selectPreset persists the selection and keeps local presets", () => {
    const { result } = renderHook(() => useBisListsDomain());

    act(() => {
      result.current.savePresetByName(ClassName.DeathKnight, "Unholy", "Local A", [
        { slot: 1, itemIds: [54581] },
      ]);
    });

    act(() => {
      result.current.selectPreset(
        ClassName.DeathKnight,
        "Unholy",
        builtInPresetId,
      );
    });

    const presets = result.current.getPresetsForSpec(
      ClassName.DeathKnight,
      "Unholy",
    );
    expect(result.current.getSelectedPreset(ClassName.DeathKnight, "Unholy")?.id).toBe(
      builtInPresetId,
    );
    expect(presets.some((preset) => preset.id.startsWith("local-"))).toBe(true);

    flushBisListsSave();
    const persisted = readPersistedBisLists();
    expect(persisted.entries[storageKey].selectedPresetId).toBe(builtInPresetId);
    expect(persisted.entries[storageKey].presets).toHaveLength(1);
  });

  it("savePresetByName creates a local preset and selects it", () => {
    const { result } = renderHook(() => useBisListsDomain());

    let saveResult: { ok: true } | { ok: false; error: string } = { ok: false, error: "" };
    act(() => {
      saveResult = result.current.savePresetByName(
        ClassName.DeathKnight,
        "Unholy",
        "My list",
        [{ slot: 0, itemIds: [51312] }],
      );
    });

    expect(saveResult).toEqual({ ok: true });
    const selected = result.current.getSelectedPreset(ClassName.DeathKnight, "Unholy");
    expect(selected?.name).toBe("My list");
    expect(selected?.id).toMatch(/^local-/);
    expect(result.current.getBisSlotMapForSpec(ClassName.DeathKnight, "Unholy").get(0)).toEqual([
      51312,
    ]);

    flushBisListsSave();
    const persisted = readPersistedBisLists();
    expect(persisted.schemaVersion).toBe(BIS_LISTS_SCHEMA_VERSION);
    expect(persisted.entries[storageKey].presets[0].name).toBe("My list");
  });

  it("savePresetByName returns validation errors from duplicate built-in names", () => {
    const { result } = renderHook(() => useBisListsDomain());

    let saveResult: { ok: true } | { ok: false; error: string } = { ok: false, error: "" };
    act(() => {
      saveResult = result.current.savePresetByName(
        ClassName.DeathKnight,
        "Unholy",
        unholyDeathKnightBis.presets[0]!.name,
        [{ slot: 0, itemIds: [51312] }],
      );
    });

    expect(saveResult).toEqual({
      ok: false,
      error: "Use a custom name (not a built-in list name)",
    });
    expect(readPersistedBisLists()).toBeNull();
  });

  it("updateSelectedLocalPresetSlots updates the active local preset", () => {
    const { result } = renderHook(() => useBisListsDomain());

    act(() => {
      result.current.savePresetByName(ClassName.DeathKnight, "Unholy", "Editable", [
        { slot: 0, itemIds: [51312] },
      ]);
    });

    act(() => {
      result.current.updateSelectedLocalPresetSlots(ClassName.DeathKnight, "Unholy", [
        { slot: 0, itemIds: [51312] },
        { slot: 1, itemIds: [54581] },
      ]);
    });

    const slotMap = result.current.getBisSlotMapForSpec(ClassName.DeathKnight, "Unholy");
    expect(slotMap.get(1)).toEqual([54581]);
  });

  it("updateSelectedLocalPresetSlots no-ops when the built-in preset is selected", () => {
    const { result } = renderHook(() => useBisListsDomain());

    act(() => {
      result.current.selectPreset(
        ClassName.DeathKnight,
        "Unholy",
        builtInPresetId,
      );
    });

    act(() => {
      result.current.updateSelectedLocalPresetSlots(ClassName.DeathKnight, "Unholy", [
        { slot: 0, itemIds: [1] },
      ]);
    });

    expect(
      result.current.getBisSlotMapForSpec(ClassName.DeathKnight, "Unholy").get(0),
    ).toEqual([51312]);
    flushBisListsSave();
    expect(readPersistedBisLists().entries[storageKey].presets).toEqual([]);
  });

  it("deleteLocalPreset removes a local preset and falls back to built-in", () => {
    const { result } = renderHook(() => useBisListsDomain());

    act(() => {
      result.current.savePresetByName(ClassName.DeathKnight, "Unholy", "Delete me", [
        { slot: 1, itemIds: [54581] },
      ]);
    });

    const localPresetId = result.current.getSelectedPreset(
      ClassName.DeathKnight,
      "Unholy",
    )!.id;

    act(() => {
      result.current.deleteLocalPreset(ClassName.DeathKnight, "Unholy", localPresetId);
    });

    expect(
      result.current.getPresetsForSpec(ClassName.DeathKnight, "Unholy").some((preset) =>
        preset.id.startsWith("local-"),
      ),
    ).toBe(false);
    expect(result.current.getSelectedPreset(ClassName.DeathKnight, "Unholy")?.id).toBe(
      builtInPresetId,
    );
  });

  it("deleteLocalPreset ignores built-in preset ids", () => {
    const { result } = renderHook(() => useBisListsDomain());

    act(() => {
      result.current.deleteLocalPreset(
        ClassName.DeathKnight,
        "Unholy",
        builtInPresetId,
      );
    });

    expect(readPersistedBisLists()).toBeNull();
  });
});
