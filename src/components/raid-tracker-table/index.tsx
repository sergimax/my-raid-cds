import { Stack, Table, TableBody, TableContainer } from "@mui/material";
import { memo, useCallback, useMemo, useState } from "react";
import { ExportPanel } from "../export-panel/index.tsx";
import { getExportToolbarPanelMeta } from "../tracker-toolbar-panel/toolbar-panel-meta.ts";
import { TrackerToolbarPanel } from "../tracker-toolbar-panel/index.tsx";
import { CharacterEditDialog } from "../character-edit-dialog/index.tsx";
import { DungeonEditDialog } from "../dungeon-edit-dialog/index.tsx";
import { useRaidTrackerContext } from "../../hooks/use-raid-tracker-context.ts";
import { useTranslation } from "../../i18n/use-translation.ts";
import type { DungeonRecord } from "../../types/dungeons.ts";
import { DungeonTableRow } from "./dungeon-table-row.tsx";
import { RaidTrackerDeleteDialog } from "./raid-tracker-delete-dialog.tsx";
import { raidTrackerTableAriaLabel } from "./raid-tracker-table-empty-state.ts";
import { RaidTrackerTableEmptyState } from "./raid-tracker-table-empty-state.tsx";
import { RaidTrackerTableHead } from "./raid-tracker-table-head.tsx";
import "./styles.css";
import { useRaidTrackerTableState } from "./use-raid-tracker-table-state.ts";

type RaidTrackerTableProps = {
  showExportPanel: boolean;
  closeExportPanel: () => void;
};

export const RaidTrackerTable = memo(function RaidTrackerTable({
  showExportPanel,
  closeExportPanel,
}: RaidTrackerTableProps) {
  const { t } = useTranslation();
  const domain = useRaidTrackerContext();
  const {
    characters,
    dungeons,
    dungeonToggles,
    handleDungeonToggle: onDungeonToggle,
    handleDeleteCharacter: onDeleteCharacter,
    handleDeleteDungeon: onDeleteDungeon,
    handleResetCharacterToggles: onResetCharacterToggles,
    updateCharacter,
    updateDungeon,
  } = domain;

  const [editingCharacterId, setEditingCharacterId] = useState<string | null>(
    null,
  );
  const [editingDungeonId, setEditingDungeonId] = useState<string | null>(null);
  const editingCharacter = useMemo(
    () => characters.find((character) => character.id === editingCharacterId) ?? null,
    [characters, editingCharacterId],
  );
  const editingDungeon = useMemo(
    () => dungeons.find((dungeon) => dungeon.id === editingDungeonId) ?? null,
    [dungeons, editingDungeonId],
  );

  const handleEditCharacter = useCallback((characterId: string) => {
    setEditingCharacterId(characterId);
  }, []);

  const handleCloseEditCharacter = useCallback(() => {
    setEditingCharacterId(null);
  }, []);

  const handleEditDungeon = useCallback((dungeonId: string) => {
    setEditingDungeonId(dungeonId);
  }, []);

  const handleCloseEditDungeon = useCallback(() => {
    setEditingDungeonId(null);
  }, []);

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

  const exportToolbarPanelMeta = useMemo(
    () => getExportToolbarPanelMeta(t, closeExportPanel),
    [closeExportPanel, t],
  );

  return (
    <Stack spacing={2}>
      {showExportPanel ? (
        <TrackerToolbarPanel panelId="export" {...exportToolbarPanelMeta}>
          <ExportPanel
            characters={characters}
            visibleDungeons={sortedDungeons}
            dungeonToggles={dungeonToggles}
          />
        </TrackerToolbarPanel>
      ) : null}
      <TableContainer sx={{ overflowX: "auto" }}>
        <Table
          aria-label={raidTrackerTableAriaLabel(
            dungeons.length,
            sortedDungeons.length,
            t,
          )}
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
            onEditCharacter={handleEditCharacter}
            onRequestDeleteCharacter={handleRequestDeleteCharacter}
          />
          <TableBody>
            {dungeons.length === 0 ? (
              <RaidTrackerTableEmptyState
                variant="no-dungeons"
                visiblePinnedColumns={visiblePinnedColumns}
                characterCount={characterCount}
              />
            ) : sortedDungeons.length === 0 ? (
              <RaidTrackerTableEmptyState
                variant="no-search-matches"
                visiblePinnedColumns={visiblePinnedColumns}
                characterCount={characterCount}
              />
            ) : (
              sortedDungeons.map((dungeon: DungeonRecord) => (
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
                  onEditDungeon={handleEditDungeon}
                  onRequestDeleteDungeon={handleRequestDeleteDungeon}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <RaidTrackerDeleteDialog
        pendingDelete={pendingDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
      <CharacterEditDialog
        character={editingCharacter}
        onClose={handleCloseEditCharacter}
        onSave={updateCharacter}
      />
      <DungeonEditDialog
        dungeon={editingDungeon}
        onClose={handleCloseEditDungeon}
        onSave={updateDungeon}
      />
    </Stack>
  );
});
