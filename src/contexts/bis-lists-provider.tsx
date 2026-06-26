import { useBisListsDomain } from "../hooks/use-bis-lists-domain.ts";
import { BisListsContext } from "./bis-lists-context.ts";

type BisListsProviderProps = {
  children: React.ReactNode;
};

export function BisListsProvider({ children }: BisListsProviderProps) {
  const domain = useBisListsDomain();

  return (
    <BisListsContext.Provider value={domain}>{children}</BisListsContext.Provider>
  );
}
