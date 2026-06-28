import { useEffect } from "react";

/** Scrolls the page to the top when a toolbar panel opens or switches. */
export function useScrollToTopOnPanelOpen(panelId: string) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [panelId]);
}
