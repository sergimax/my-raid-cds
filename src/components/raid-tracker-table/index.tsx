import { Table, TableBody, TableContainer } from "@mui/material";
import { useRaidTrackerContext } from "../../hooks/use-raid-tracker-context.ts";
import type { DungeonRecord } from "../../types/dungeons.ts";
import { DungeonTableRow } from "./dungeon-table-row.tsx";
import { RaidTrackerDeleteDialog } from "./raid-tracker-delete-dialog.tsx";
import { RaidTrackerTableHead } from "./raid-tracker-table-head.tsx";
import "./styles.css";
import { useRaidTrackerTableState } from "./use-raid-tracker-table-state.ts";

export function RaidTrackerTable() {
  const tracker = useRaidTrackerContext();
  const {
    characters,
    dungeons,
    dungeonToggles,
    handleDungeonToggle: onDungeonToggle,
    handleDeleteCharacter: onDeleteCharacter,
    handleDeleteDungeon: onDeleteDungeon,
    handleResetCharacterToggles: onResetCharacterToggles,
  } = tracker;

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
    completionsByCharacterId,
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
          completionsByCharacterId={completionsByCharacterId}
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
      <RaidTrackerDeleteDialog
        pendingDelete={pendingDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </TableContainer>
  );
}
