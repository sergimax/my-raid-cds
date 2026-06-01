import type { ReactNode } from "react";
import { useRaidTracker } from "../hooks/use-raid-tracker.ts";
import { RaidTrackerContext } from "./raid-tracker-context.ts";

export function RaidTrackerProvider({ children }: { children: ReactNode }) {
  const value = useRaidTracker();
  return (
    <RaidTrackerContext.Provider value={value}>{children}</RaidTrackerContext.Provider>
  );
}
