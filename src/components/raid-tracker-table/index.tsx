import { Table, TableBody, TableContainer } from "@mui/material";
import type { DungeonRecord } from "../../types/dungeons.ts";
import { DeleteConfirmDialog } from "./delete-confirm-dialog.tsx";
import { DungeonTableRow } from "./dungeon-table-row.tsx";
import { RaidTrackerTableHead } from "./raid-tracker-table-head.tsx";
import "./styles.css";
import type { RaidTrackerTableProps } from "./types.ts";
import { useRaidTrackerTableState } from "./use-raid-tracker-table-state.ts";

export function RaidTrackerTable({
  characters,
  dungeons,
  dungeonToggles,
  onDungeonToggle,
  onDeleteCharacter,
  onDeleteDungeon,
  onResetCharacterToggles,
}: RaidTrackerTableProps) {
  const tableState = useRaidTrackerTableState({
    characters,
    dungeons,
    dungeonToggles,
    onDeleteCharacter,
    onDeleteDungeon,
  });

  const {
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
  } = tableState;

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
        <RaidTrackerTableHead
          compactTable={compactTable}
          visiblePinnedColumns={visiblePinnedColumns}
          characters={characters}
          dungeons={dungeons}
          dungeonToggles={dungeonToggles}
          dungeonCount={dungeonCount}
          sortKey={sortKey}
          sortDirection={sortDirection}
          characterSortId={characterSortId}
          characterSortDirection={characterSortDirection}
          dungeonNameSearch={dungeonNameSearch}
          onDungeonNameSearchChange={setDungeonNameSearch}
          onSort={handleSort}
          onCharacterSort={handleCharacterSort}
          onResetCharacterToggles={onResetCharacterToggles}
          onRequestDeleteCharacter={handleRequestDeleteCharacter}
        />
        <TableBody>
          {sortedDungeons.map((dungeon: DungeonRecord) => (
            <DungeonTableRow
              key={dungeon.id}
              dungeon={dungeon}
              characters={characters}
              compactTable={compactTable}
              visiblePinnedColumns={visiblePinnedColumns}
              completionsByDungeonId={completionsByDungeonId}
              characterCount={characterCount}
              dungeonToggles={dungeonToggles}
              onDungeonToggle={onDungeonToggle}
              onRequestDeleteDungeon={handleRequestDeleteDungeon}
            />
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
