/**
 * One dungeon table row: delete action, pinned dungeon field cells, and
 * per-character cooldown toggle switches.
 */
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton, Stack, TableCell, TableRow, Tooltip } from "@mui/material";
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
  return (
    <TableRow hover>
      <TableCell sx={pinnedActionsColumnSx(compactTable, false)}>
        <Stack direction="row" spacing={0.25} sx={{ justifyContent: "center" }}>
          <Tooltip title={`Edit details for ${dungeon.name}`}>
            <IconButton
              size="small"
              color="default"
              onClick={() => {
                onEditDungeon(dungeon.id);
              }}
              aria-label={`Edit details for ${dungeon.name}`}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={`Delete dungeon: ${dungeon.name}`}>
          <IconButton
            size="small"
            color="error"
            onClick={() => {
              onRequestDeleteDungeon(dungeon);
            }}
            aria-label={`Delete dungeon: ${dungeon.name}`}
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
        />
      ))}
    </TableRow>
  );
}
