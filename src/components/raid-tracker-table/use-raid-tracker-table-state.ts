/**
 * Ephemeral UI state for the raid tracker table: dungeon/character sorting,
 * name search, delete confirmation, responsive pinned-column layout, and
 * derived row data (filtered/sorted dungeons, per-dungeon completion counts).
 */
import { useMediaQuery, useTheme } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import type { DungeonRecord } from "../../types/dungeons.ts";
import { countCompletedForDungeon } from "../../utils/completion-counts.ts";
import { filterDungeonsByName } from "../../utils/filter-dungeons-by-name.ts";
import {
  defaultSortDirectionForKey,
  sortDungeons,
  sortDungeonsByCharacterToggle,
  type DungeonSortKey,
  type SortDirection,
} from "../../utils/sort-dungeons.ts";
import { pinnedColumnsForLayout } from "./table-layout.ts";
import type { RaidTrackerTableProps } from "./types.ts";

export type PendingDelete =
  | { kind: "character"; id: string; name: string }
  | { kind: "dungeon"; id: string; name: string };

type UseRaidTrackerTableStateParams = Pick<
  RaidTrackerTableProps,
  | "characters"
  | "dungeons"
  | "dungeonToggles"
  | "onDeleteCharacter"
  | "onDeleteDungeon"
>;

export function useRaidTrackerTableState({
  characters,
  dungeons,
  dungeonToggles,
  onDeleteCharacter,
  onDeleteDungeon,
}: UseRaidTrackerTableStateParams) {
  const theme = useTheme();
  const compactTable = useMediaQuery(theme.breakpoints.down("md"));
  const visiblePinnedColumns = useMemo(
    () => pinnedColumnsForLayout(compactTable),
    [compactTable],
  );

  const dungeonCount = dungeons.length;
  const characterCount = characters.length;
  const [sortKey, setSortKey] = useState<DungeonSortKey>("itemLevel");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [characterSortId, setCharacterSortId] = useState<string | null>(null);
  const [characterSortDirection, setCharacterSortDirection] =
    useState<SortDirection>("desc");
  const [dungeonNameSearch, setDungeonNameSearch] = useState("");
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(
    null,
  );

  const handleRequestDeleteCharacter = useCallback(
    (characterId: string) => {
      const character = characters.find((entry) => entry.id === characterId);
      if (!character) return;
      setPendingDelete({
        kind: "character",
        id: characterId,
        name: character.name,
      });
    },
    [characters],
  );

  const handleRequestDeleteDungeon = useCallback((dungeon: DungeonRecord) => {
    setPendingDelete({
      kind: "dungeon",
      id: dungeon.id,
      name: dungeon.name,
    });
  }, []);

  const handleCancelDelete = useCallback(() => {
    setPendingDelete(null);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!pendingDelete) return;
    if (pendingDelete.kind === "character") {
      onDeleteCharacter(pendingDelete.id);
    } else {
      onDeleteDungeon(pendingDelete.id);
    }
    setPendingDelete(null);
  }, [pendingDelete, onDeleteCharacter, onDeleteDungeon]);

  const handleSort = useCallback(
    (nextSortKey: DungeonSortKey) => {
      setCharacterSortId(null);
      if (nextSortKey === sortKey) {
        setSortDirection((previous) => (previous === "asc" ? "desc" : "asc"));
      } else {
        setSortKey(nextSortKey);
        setSortDirection(defaultSortDirectionForKey(nextSortKey));
      }
    },
    [sortKey],
  );

  const handleCharacterSort = useCallback(
    (nextCharacterId: string) => {
      setSortKey("itemLevel");
      setSortDirection("desc");
      if (characterSortId === nextCharacterId) {
        setCharacterSortDirection((previous) =>
          previous === "asc" ? "desc" : "asc",
        );
      } else {
        setCharacterSortId(nextCharacterId);
        setCharacterSortDirection("desc");
      }
    },
    [characterSortId],
  );

  const filteredDungeons = useMemo(
    () => filterDungeonsByName(dungeons, dungeonNameSearch),
    [dungeons, dungeonNameSearch],
  );

  const completionsByDungeonId = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const dungeon of dungeons) {
      counts[dungeon.id] = countCompletedForDungeon(
        dungeon.id,
        characters,
        dungeonToggles,
      );
    }
    return counts;
  }, [characters, dungeonToggles, dungeons]);

  const sortedDungeons = useMemo(() => {
    if (characterSortId) {
      return sortDungeonsByCharacterToggle(
        filteredDungeons,
        characterSortId,
        characterSortDirection,
        dungeonToggles,
      );
    }
    return sortDungeons(
      filteredDungeons,
      sortKey,
      sortDirection,
      completionsByDungeonId,
    );
  }, [
    characterSortDirection,
    characterSortId,
    completionsByDungeonId,
    dungeonToggles,
    filteredDungeons,
    sortDirection,
    sortKey,
  ]);

  return {
    compactTable,
    visiblePinnedColumns,
    dungeonCount,
    characterCount,
    sortKey,
    sortDirection,
    characterSortId,
    characterSortDirection,
    dungeonNameSearch,
    setDungeonNameSearch,
    pendingDelete,
    sortedDungeons,
    completionsByDungeonId,
    handleSort,
    handleCharacterSort,
    handleRequestDeleteCharacter,
    handleRequestDeleteDungeon,
    handleCancelDelete,
    handleConfirmDelete,
  };
}
