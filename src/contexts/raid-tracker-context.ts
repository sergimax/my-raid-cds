import { createContext } from "react";
import type { RaidTrackerStore } from "../hooks/use-raid-tracker.ts";

export type RaidTrackerContextValue = RaidTrackerStore;

export const RaidTrackerContext = createContext<RaidTrackerContextValue | null>(
  null,
);
