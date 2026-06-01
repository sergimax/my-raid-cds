import SportsScoreIcon from "@mui/icons-material/SportsScore";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  IconButton,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { type CharacterRecord } from "../../types/characters.ts";
import type { DungeonRecord } from "../../types/dungeons.ts";
import { countCompletedForDungeon } from "../../utils/completion-counts.ts";
import {
  defaultSortDirectionForKey,
  sortDungeons,
  type DungeonSortKey,
  type SortDirection,
} from "../../utils/sort-dungeons.ts";
import { DungeonNameHeaderCell } from "./dungeon-name-header-cell.tsx";
import { SortableHeaderCell } from "./sortable-header-cell.tsx";
import { filterDungeonsByName } from "../../utils/filter-dungeons-by-name.ts";
import type { RaidTrackerTableProps } from "./types.ts";
import "./styles.css";
import {
  CHARACTER_BODY_CELL_SX,
  pinnedActionsColumnSx,
  pinnedBodySxForColumn,
  pinnedColumnsForLayout,
  pinnedHeaderSxForColumn,
} from "./table-layout.ts";
import { CharacterHeaderCell } from "./character-header-cell.tsx";
import {
  CompletionCountChip,
  DungeonDifficultyCell,
  DungeonNameCell,
  DungeonSizeCell,
  ItemLevelCell,
} from "./dungeon-cells.tsx";
import { formatDungeonCell } from "./format-dungeon-cell.ts";
import { DeleteConfirmDialog } from "./delete-confirm-dialog.tsx";

type PendingDelete =
  | { kind: "character"; id: string; name: string }
  | { kind: "dungeon"; id: string; name: string };

export function RaidTrackerTable({
  characters,
  dungeons,
  dungeonToggles,
  onDungeonToggle,
  onDeleteCharacter,
  onDeleteDungeon,
  onResetCharacterToggles,
}: RaidTrackerTableProps) {
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
      const character = characters.find(
        (entry) => entry.id === characterId,
      );
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

  const handleSort = useCallback((nextSortKey: DungeonSortKey) => {
    setCharacterSortId(null);
    if (nextSortKey === sortKey) {
      setSortDirection((previous) => (previous === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(nextSortKey);
      setSortDirection(defaultSortDirectionForKey(nextSortKey));
    }
  }, [sortKey]);

  const handleCharacterSort = useCallback((nextCharacterId: string) => {
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
  }, [characterSortId]);

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
      const sorted = [...filteredDungeons].sort((firstDungeon, secondDungeon) => {
        const firstValue = dungeonToggles[characterSortId]?.[firstDungeon.id]
          ? 1
          : 0;
        const secondValue = dungeonToggles[characterSortId]?.[secondDungeon.id]
          ? 1
          : 0;
        const comparison =
          firstValue - secondValue ||
          firstDungeon.name.localeCompare(secondDungeon.name) ||
          firstDungeon.size - secondDungeon.size;
        return characterSortDirection === "asc" ? comparison : -comparison;
      });
      return sorted;
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

  return (
    <TableContainer sx={{ overflowX: "auto" }}>
      <Table
        className={
          compactTable
            ? "raid-tracker-table raid-tracker-table--compact"
            : "raid-tracker-table"
        }
        size="small"
        stickyHeader
        sx={{ tableLayout: "fixed", width: "max-content" }}
      >
        <TableHead>
          <TableRow>
            <TableCell
              sx={pinnedActionsColumnSx(compactTable, true)}
              aria-label="Row actions"
            />
            {visiblePinnedColumns.map((column) =>
              column.key === "name" ? (
                <DungeonNameHeaderCell
                  key={column.key}
                  activeSortKey={sortKey}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  searchQuery={dungeonNameSearch}
                  onSearchQueryChange={setDungeonNameSearch}
                  sx={pinnedHeaderSxForColumn(column.key, compactTable)}
                />
              ) : column.key === "complete" ? (
                <SortableHeaderCell
                  key={column.key}
                  label={<SportsScoreIcon fontSize="small" />}
                  sortKey={column.sortKey}
                  sortAriaLabel={column.label}
                  activeSortKey={sortKey}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  align="center"
                  sx={pinnedHeaderSxForColumn(column.key, compactTable)}
                />
              ) : (
                <SortableHeaderCell
                  key={column.key}
                  label={column.label}
                  sortKey={column.sortKey}
                  sortAriaLabel={column.label}
                  activeSortKey={sortKey}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  sx={pinnedHeaderSxForColumn(column.key, compactTable)}
                />
              ),
            )}
            {characters.map((character: CharacterRecord) => (
              <CharacterHeaderCell
                key={character.id}
                character={character}
                dungeonCount={dungeonCount}
                dungeons={dungeons}
                dungeonToggles={dungeonToggles}
                isActiveSort={characterSortId === character.id}
                sortDirection={
                  characterSortId === character.id ? characterSortDirection : "asc"
                }
                onSort={() => {
                  handleCharacterSort(character.id);
                }}
                onResetCharacterToggles={onResetCharacterToggles}
                onDeleteCharacter={handleRequestDeleteCharacter}
              />
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedDungeons.map((dungeon: DungeonRecord) => (
            <TableRow key={dungeon.id} hover>
              <TableCell sx={pinnedActionsColumnSx(compactTable, false)}>
                <Tooltip title={`Delete dungeon: ${dungeon.name}`}>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => {
                      handleRequestDeleteDungeon(dungeon);
                    }}
                    aria-label={`Delete dungeon: ${dungeon.name}`}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
              {visiblePinnedColumns.map((column) => (
                <TableCell
                  key={column.key}
                  align={column.key === "complete" ? "center" : undefined}
                  sx={pinnedBodySxForColumn(column.key, compactTable)}
                >
                  {column.key === "name" ? (
                    <DungeonNameCell
                      name={dungeon.name}
                      itemLevels={dungeon.itemLevel}
                      emblem={dungeon.emblem ?? null}
                    />
                  ) : column.key === "size" ? (
                    <DungeonSizeCell size={dungeon.size} />
                  ) : column.key === "difficulty" ? (
                    <DungeonDifficultyCell difficulty={dungeon.difficulty} />
                  ) : column.key === "itemLevel" ? (
                    <ItemLevelCell itemLevels={dungeon.itemLevel} />
                  ) : column.key === "complete" ? (
                    <CompletionCountChip
                      completed={completionsByDungeonId[dungeon.id] ?? 0}
                      total={characterCount}
                    />
                  ) : (
                    formatDungeonCell(dungeon, column.key)
                  )}
                </TableCell>
              ))}
              {characters.map((character: CharacterRecord) => (
                <TableCell
                  key={character.id}
                  align="center"
                  sx={CHARACTER_BODY_CELL_SX}
                >
                  <Switch
                    size="small"
                    checked={
                      dungeonToggles[character.id]?.[dungeon.id] ?? false
                    }
                    onChange={() => {
                      onDungeonToggle(character.id, dungeon.id);
                    }}
                    slotProps={{
                      input: {
                        "aria-label": `${character.name} — ${dungeon.name}`,
                      },
                    }}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <DeleteConfirmDialog
        open={pendingDelete !== null}
        title={
          pendingDelete?.kind === "character"
            ? "Remove character?"
            : "Delete dungeon?"
        }
        message={
          pendingDelete?.kind === "character"
            ? `Remove "${pendingDelete.name}" and all cooldown toggles for this character? This cannot be undone.`
            : pendingDelete?.kind === "dungeon"
              ? `Delete "${pendingDelete.name}" and all cooldown toggles for this dungeon? This cannot be undone.`
              : ""
        }
        confirmLabel={
          pendingDelete?.kind === "character" ? "Remove" : "Delete"
        }
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </TableContainer>
  );
}
