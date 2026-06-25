import { useCallback, useState } from "react";

export function useExportPanelState() {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    showExportPanel: isOpen,
    openExportPanel: open,
    closeExportPanel: close,
  };
}
