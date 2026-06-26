import { useEffect, useRef } from "react";

/** Scrolls the returned ref into view once when the host mounts (e.g. toggled panels). */
export function useScrollIntoViewOnMount<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return ref;
}
