export type RaidTrackerTableEmptyVariant = "no-dungeons" | "no-search-matches";

export function emptyStateMessage(variant: RaidTrackerTableEmptyVariant): string {
  if (variant === "no-dungeons") {
    return "Add a dungeon or use Add from template to get started.";
  }
  return "No dungeons match your search.";
}

export function raidTrackerTableAriaLabel(
  dungeonCount: number,
  visibleRowCount: number,
): string {
  if (dungeonCount === 0) {
    return "Raid cooldown tracker, no dungeons";
  }
  if (visibleRowCount === 0) {
    return "Raid cooldown tracker, no dungeons match search";
  }
  return "Raid cooldown tracker by dungeon and character";
}
