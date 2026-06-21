/**
 * Two-step delete flow: hold a pending item, then confirm or cancel before
 * invoking a single onConfirm callback.
 */
import { useCallback, useState } from "react";

export type PendingDeleteKind = "character" | "dungeon";

export type PendingDeleteItem = {
  kind: PendingDeleteKind;
  id: string;
  name: string;
};

export function usePendingDelete<T extends PendingDeleteItem>(
  onConfirm: (item: T) => void,
) {
  const [pendingDelete, setPendingDelete] = useState<T | null>(null);

  const requestDelete = useCallback((item: T) => {
    setPendingDelete(item);
  }, []);

  const cancelDelete = useCallback(() => {
    setPendingDelete(null);
  }, []);

  const confirmDelete = useCallback(() => {
    if (!pendingDelete) return;
    onConfirm(pendingDelete);
    setPendingDelete(null);
  }, [onConfirm, pendingDelete]);

  return {
    pendingDelete,
    requestDelete,
    cancelDelete,
    confirmDelete,
  };
}