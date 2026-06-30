/**
 * One dungeon table row: delete action, pinned dungeon field cells, and
 * per-character cooldown toggle switches.
 */
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton, Stack, TableCell, TableRow, Tooltip } from "@mui/material";
import { useTranslation } from "../../i18n/use-translation.ts";
import { useBisListsContext } from "../../hooks/use-bis-lists-context.ts";
import { getLocalizedDungeonDisplayName } from "../../i18n/localized-domain.ts";
import type { CharacterRecord } from "../../types/characters.ts";
import type { DungeonRecord, DungeonToggles } from "../../types/dungeons.ts";
import { CharacterToggleCell } from "./character-toggle-cell.tsx";
import {
  pinnedColumnBodyAlign,
  pinnedColumnBodySx,
  renderPinnedColumnBody,
} from "./pinned-column-renderers.tsx";
import {
  pinnedActionsColumnSx,
  type PinnedColumnDef,
} from "./table-layout.ts";

type DungeonTableRowProps = {
  dungeon: DungeonRecord;
  characters: CharacterRecord[];
  compactTable: boolean;
  visiblePinnedColumns: ReadonlyArray<PinnedColumnDef>;
  completionsByDungeonId: Readonly<Record<string, number>>;
  characterCount: number;
  dungeonToggles: DungeonToggles;
  onDungeonToggle: (characterId: string, dungeonId: string) => void;
  onEditDungeon: (dungeonId: string) => void;
  onRequestDeleteDungeon: (dungeon: DungeonRecord) => void;
};

export function DungeonTableRow({
  dungeon,
  characters,
  compactTable,
  visiblePinnedColumns,
  completionsByDungeonId,
  characterCount,
  dungeonToggles,
  onDungeonToggle,
  onEditDungeon,
  onRequestDeleteDungeon,
}: DungeonTableRowProps) {
  const { t, locale } = useTranslation();
  const { getBisSlotMapForSpec } = useBisListsContext();
  const dungeonDisplayName = getLocalizedDungeonDisplayName(dungeon, locale, false);

  return (
    <TableRow hover>
      <TableCell sx={pinnedActionsColumnSx(compactTable, false)}>
        <Stack direction="row" spacing={0.25} sx={{ justifyContent: "center" }}>
          <Tooltip title={t("table.editDungeon", { name: dungeonDisplayName })}>
            <IconButton
              size="small"
              color="default"
              onClick={() => {
                onEditDungeon(dungeon.id);
              }}
              aria-label={t("table.editDungeon", { name: dungeonDisplayName })}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("table.deleteDungeon", { name: dungeonDisplayName })}>
          <IconButton
            size="small"
            color="error"
            onClick={() => {
              onRequestDeleteDungeon(dungeon);
            }}
            aria-label={t("table.deleteDungeon", { name: dungeonDisplayName })}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        </Stack>
      </TableCell>
      {visiblePinnedColumns.map((column) => (
        <TableCell
          key={column.key}
          align={pinnedColumnBodyAlign(column.key)}
          sx={pinnedColumnBodySx(column.key, compactTable)}
        >
          {renderPinnedColumnBody({
            column,
            compactTable,
            dungeon,
            completionsByDungeonId,
            characterCount,
          })}
        </TableCell>
      ))}
      {characters.map((character) => (
        <CharacterToggleCell
          key={character.id}
          character={character}
          dungeon={dungeon}
          dungeonToggles={dungeonToggles}
          onDungeonToggle={onDungeonToggle}
          locale={locale}
          getBisSlotMapForSpec={getBisSlotMapForSpec}
        />
      ))}
    </TableRow>
  );
}
