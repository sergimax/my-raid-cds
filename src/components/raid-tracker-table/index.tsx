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
  Typography,
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
  COMPLETE_COLUMN,
  PINNED_LEFT,
  PINNED_WIDTHS,
  STATIC_COLUMNS,
  pinnedCellSx,
  pinnedHeaderCellSx,
} from "./table-layout.ts";
import { CharacterHeaderCell } from "./character-header-cell.tsx";
import {
  DungeonDifficultyCell,
  DungeonNameCell,
  DungeonSizeCell,
  ItemLevelCell,
} from "./dungeon-cells.tsx";
import { formatDungeonCell } from "./format-dungeon-cell.ts";

export function RaidTrackerTable({
  characters,
  dungeons,
  dungeonToggles,
  onDungeonToggle,
  onDeleteCharacter,
  onDeleteDungeon,
  onResetCharacterToggles,
}: RaidTrackerTableProps) {
  const dungeonCount = dungeons.length;
  const characterCount = characters.length;
  const [sortKey, setSortKey] = useState<DungeonSortKey>("itemLevel");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [characterSortId, setCharacterSortId] = useState<string | null>(null);
  const [characterSortDirection, setCharacterSortDirection] =
    useState<SortDirection>("desc");
  const [dungeonNameSearch, setDungeonNameSearch] = useState("");

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
        className="raid-tracker-table"
        size="small"
        stickyHeader
        sx={{ tableLayout: "fixed", width: "max-content" }}
      >
        <TableHead>
          <TableRow>
            <TableCell
              sx={pinnedHeaderCellSx(PINNED_LEFT.actions, PINNED_WIDTHS.actions)}
              aria-label="Row actions"
            />
            {STATIC_COLUMNS.map((column) =>
              column.key === "name" ? (
                <DungeonNameHeaderCell
                  key={column.key}
                  activeSortKey={sortKey}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  searchQuery={dungeonNameSearch}
                  onSearchQueryChange={setDungeonNameSearch}
                  sx={pinnedHeaderCellSx(PINNED_LEFT.name, PINNED_WIDTHS.name)}
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
                  sx={
                    column.key === "size"
                      ? pinnedHeaderCellSx(PINNED_LEFT.size, PINNED_WIDTHS.size)
                      : column.key === "difficulty"
                        ? pinnedHeaderCellSx(
                            PINNED_LEFT.difficulty,
                            PINNED_WIDTHS.difficulty,
                          )
                        : column.key === "itemLevel"
                          ? pinnedHeaderCellSx(
                              PINNED_LEFT.itemLevel,
                              PINNED_WIDTHS.itemLevel,
                            )
                          : undefined
                  }
                />
              ),
            )}
            <SortableHeaderCell
              label={<SportsScoreIcon fontSize="small" />}
              sortKey={COMPLETE_COLUMN.sortKey}
              sortAriaLabel={COMPLETE_COLUMN.label}
              activeSortKey={sortKey}
              sortDirection={sortDirection}
              onSort={handleSort}
              align="center"
              sx={pinnedHeaderCellSx(PINNED_LEFT.complete, PINNED_WIDTHS.complete)}
            />
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
                onDeleteCharacter={onDeleteCharacter}
              />
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedDungeons.map((dungeon: DungeonRecord) => (
            <TableRow key={dungeon.id} hover>
              <TableCell sx={pinnedCellSx(PINNED_LEFT.actions, PINNED_WIDTHS.actions)}>
                <Tooltip title={`Delete dungeon: ${dungeon.name}`}>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => {
                      onDeleteDungeon(dungeon.id);
                    }}
                    aria-label={`Delete dungeon: ${dungeon.name}`}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
              {STATIC_COLUMNS.map((column) => (
                <TableCell
                  key={column.key}
                  sx={
                    column.key === "name"
                      ? pinnedCellSx(PINNED_LEFT.name, PINNED_WIDTHS.name)
                      : column.key === "size"
                        ? pinnedCellSx(PINNED_LEFT.size, PINNED_WIDTHS.size)
                        : column.key === "difficulty"
                          ? pinnedCellSx(
                              PINNED_LEFT.difficulty,
                              PINNED_WIDTHS.difficulty,
                            )
                          : column.key === "itemLevel"
                            ? pinnedCellSx(
                                PINNED_LEFT.itemLevel,
                                PINNED_WIDTHS.itemLevel,
                              )
                            : undefined
                  }
                >
                  {column.key === "name" ? (
                    <DungeonNameCell
                      name={dungeon.name}
                      itemLevels={dungeon.itemLevel}
                    />
                  ) : column.key === "size" ? (
                    <DungeonSizeCell size={dungeon.size} />
                  ) : column.key === "difficulty" ? (
                    <DungeonDifficultyCell difficulty={dungeon.difficulty} />
                  ) : column.key === "itemLevel" ? (
                    <ItemLevelCell itemLevels={dungeon.itemLevel} />
                  ) : (
                    formatDungeonCell(dungeon, column.key)
                  )}
                </TableCell>
              ))}
              <TableCell
                key={COMPLETE_COLUMN.key}
                align="center"
                sx={pinnedCellSx(PINNED_LEFT.complete, PINNED_WIDTHS.complete)}
              >
                <Typography variant="body2" color="text.secondary">
                  {completionsByDungeonId[dungeon.id] ?? 0}/{characterCount}
                </Typography>
              </TableCell>
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
    </TableContainer>
  );
}
