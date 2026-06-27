import type { TranslateFn } from "../../i18n/translate.ts";

export type RaidTrackerTableEmptyVariant = "no-dungeons" | "no-search-matches";

export function emptyStateMessage(
  variant: RaidTrackerTableEmptyVariant,
  t: TranslateFn,
): string {
  if (variant === "no-dungeons") {
    return t("table.emptyNoDungeons");
  }
  return t("table.emptyNoSearchMatches");
}

export function raidTrackerTableAriaLabel(
  dungeonCount: number,
  visibleRowCount: number,
  t: TranslateFn,
): string {
  if (dungeonCount === 0) {
    return t("table.ariaNoDungeons");
  }
  if (visibleRowCount === 0) {
    return t("table.ariaNoSearchMatches");
  }
  return t("table.ariaDefault");
}
