/**
 * Read raid tracker state from RaidTrackerProvider.
 * Must live in .ts (not the provider .tsx) for react-refresh rules.
 */
import { useContext } from "react";
import {
  RaidTrackerContext,
  type RaidTrackerContextValue,
} from "../contexts/raid-tracker-context.ts";

export type { RaidTrackerContextValue };

export function useRaidTrackerContext(): RaidTrackerContextValue {
  const value = useContext(RaidTrackerContext);
  if (value === null) {
    throw new Error("useRaidTrackerContext must be used within RaidTrackerProvider");
  }
  return value;
}
