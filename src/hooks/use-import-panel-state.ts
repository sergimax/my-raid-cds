import { useCallback, useState } from "react";

export function useImportPanelState() {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    showImportPanel: isOpen,
    openImportPanel: open,
    closeImportPanel: close,
  };
}
