import type { LocalBisListsState } from "../../types/bis-lists.ts";
import {
  BIS_LISTS_SCHEMA_VERSION,
  BIS_LISTS_STORAGE_KEY,
} from "./constants.ts";

const EMPTY_STATE: LocalBisListsState = {
  schemaVersion: BIS_LISTS_SCHEMA_VERSION,
  entries: {},
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function loadLocalBisListsState(): LocalBisListsState {
  try {
    const raw = localStorage.getItem(BIS_LISTS_STORAGE_KEY);
    if (!raw) {
      return EMPTY_STATE;
    }

    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.schemaVersion !== BIS_LISTS_SCHEMA_VERSION) {
      return EMPTY_STATE;
    }

    if (!isRecord(parsed.entries)) {
      return EMPTY_STATE;
    }

    return {
      schemaVersion: BIS_LISTS_SCHEMA_VERSION,
      entries: parsed.entries as LocalBisListsState["entries"],
    };
  } catch {
    return EMPTY_STATE;
  }
}

export function saveLocalBisListsState(state: LocalBisListsState): void {
  try {
    localStorage.setItem(BIS_LISTS_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore quota errors; panel edits stay in memory for the session.
  }
}
