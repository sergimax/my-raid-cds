import { createContext } from "react";
import type { BisListsDomain } from "../hooks/use-bis-lists-domain.ts";

export const BisListsContext = createContext<BisListsDomain | null>(null);
