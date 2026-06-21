/**
 * One dungeon table row: delete action, pinned dungeon field cells, and
 * per-character cooldown toggle switches.
 */
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Switch, TableCell, TableRow, Tooltip } from "@mui/material";
import type { CharacterRecord } from "../../types/characters.ts";
import type { DungeonRecord, DungeonToggles } from "../../types/dungeons.ts";
import { isCooldownOn } from "../../utils/dungeon-toggles.ts";
import {
  pinnedColumnBodyAlign,
  pinnedColumnBodySx,
  renderPinnedColumnBody,
} from "./pinned-column-renderers.tsx";
import {
  CHARACTER_BODY_CELL_SX,
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
  onRequestDeleteDungeon,
}: DungeonTableRowProps) {
  return (
    <TableRow hover>
      <TableCell sx={pinnedActionsColumnSx(compactTable, false)}>
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
        <TableCell
          key={character.id}
          align="center"
          sx={CHARACTER_BODY_CELL_SX}
        >
          <Switch
            size="small"
            checked={isCooldownOn(dungeonToggles, character.id, dungeon.id)}
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
  );
}
