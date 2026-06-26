import { useCallback, useState } from "react";

export function useBisListsPanelState() {
  const [isOpen, setIsOpen] = useState(false);

  const openBisListsPanel = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeBisListsPanel = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    showBisListsPanel: isOpen,
    openBisListsPanel,
    closeBisListsPanel,
  };
}
