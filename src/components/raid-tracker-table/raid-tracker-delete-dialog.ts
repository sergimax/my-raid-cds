import type { RaidTrackerPendingDelete } from "./types.ts";

export type RaidTrackerDeleteDialogContent = {
  title: string;
  message: string;
  confirmLabel: string;
};

const EMPTY_DIALOG_CONTENT: RaidTrackerDeleteDialogContent = {
  title: "",
  message: "",
  confirmLabel: "Delete",
};

export function getRaidTrackerDeleteDialogProps(
  pendingDelete: RaidTrackerPendingDelete | null,
): RaidTrackerDeleteDialogContent {
  if (pendingDelete === null) {
    return EMPTY_DIALOG_CONTENT;
  }

  if (pendingDelete.kind === "character") {
    return {
      title: "Remove character?",
      message: `Remove "${pendingDelete.name}" and all cooldown toggles for this character? This cannot be undone.`,
      confirmLabel: "Remove",
    };
  }

  return {
    title: "Delete dungeon?",
    message: `Delete "${pendingDelete.name}" and all cooldown toggles for this dungeon? This cannot be undone.`,
    confirmLabel: "Delete",
  };
}
