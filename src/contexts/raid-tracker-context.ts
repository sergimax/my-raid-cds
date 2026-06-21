import { createContext } from "react";
import type { TrackerDomainStore } from "../hooks/use-tracker-domain.ts";

export type RaidTrackerContextValue = TrackerDomainStore;

export const RaidTrackerContext = createContext<RaidTrackerContextValue | null>(
  null,
);
