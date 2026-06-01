import { createContext } from "react";
import type { RaidTrackerState } from "../hooks/use-raid-tracker.ts";

export type RaidTrackerContextValue = RaidTrackerState;

export const RaidTrackerContext = createContext<RaidTrackerContextValue | null>(
  null,
);
