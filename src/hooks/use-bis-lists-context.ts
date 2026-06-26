import { useContext } from "react";
import { BisListsContext } from "../contexts/bis-lists-context.ts";

export function useBisListsContext() {
  const context = useContext(BisListsContext);
  if (!context) {
    throw new Error("useBisListsContext must be used within BisListsProvider");
  }
  return context;
}
