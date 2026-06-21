import type { ReactNode } from "react";
import { useTrackerDomain } from "../hooks/use-tracker-domain.ts";
import { RaidTrackerContext } from "./raid-tracker-context.ts";

export function RaidTrackerProvider({ children }: { children: ReactNode }) {
  const value = useTrackerDomain();
  return (
    <RaidTrackerContext.Provider value={value}>{children}</RaidTrackerContext.Provider>
  );
}
