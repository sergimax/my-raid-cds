import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Fragment } from "react";
import { type CharacterRecord } from "../../types/characters.ts";
import type { DungeonRecord } from "../../types/dungeons.ts";
import { CharacterHeaderCell } from "./character-header-cell.tsx";
import { DeleteConfirmDialog } from "./delete-confirm-dialog.tsx";
import { DungeonTableRow } from "./dungeon-table-row.tsx";
import { renderPinnedColumnHeader } from "./pinned-column-renderers.tsx";
import "./styles.css";
import { pinnedActionsColumnSx } from "./table-layout.ts";
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
        <TableHead>
          <TableRow>
            <TableCell
              sx={pinnedActionsColumnSx(compactTable, true)}
              aria-label="Row actions"
            />
            {visiblePinnedColumns.map((column) => (
              <Fragment key={column.key}>
                {renderPinnedColumnHeader({
                  column,
                  compactTable,
                  sortKey,
                  sortDirection,
                  onSort: handleSort,
                  dungeonNameSearch,
                  onDungeonNameSearchChange: setDungeonNameSearch,
                })}
              </Fragment>
            ))}
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
