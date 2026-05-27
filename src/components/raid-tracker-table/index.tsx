import {
  Box,
  Button,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableSortLabel,
  TableRow,
  Typography,
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { characterNameDisplaySx, type CharacterRecord } from "../../types/characters.ts";
import type { DungeonRecord } from "../../types/dungeons.ts";
import {
  countCompletedForCharacter,
  countCompletedForDungeon,
} from "../../utils/completion-counts.ts";
import {
  getItemLevelTier,
  itemLevelTierClassName,
} from "../../utils/item-level-tier.ts";
import {
  defaultSortDirectionForKey,
  sortDungeons,
  type DungeonSortKey,
  type SortDirection,
} from "../../utils/sort-dungeons.ts";
import { SortableHeaderCell } from "./sortable-header-cell.tsx";
import type { RaidTrackerTableProps } from "./types.ts";
import "./styles.css";

const STATIC_COLUMNS: ReadonlyArray<{
  key: keyof Pick<DungeonRecord, "name" | "size" | "difficulty" | "itemLevel">;
  sortKey: DungeonSortKey;
  label: string;
}> = [
  { key: "name", sortKey: "name", label: "Dungeon name" },
  { key: "size", sortKey: "size", label: "Size" },
  { key: "difficulty", sortKey: "difficulty", label: "Difficulty" },
  { key: "itemLevel", sortKey: "itemLevel", label: "Item level" },
];

const COMPLETE_COLUMN = {
  key: "complete" as const,
  sortKey: "completions" as const,
  label: "Complete",
};

function formatDungeonCell(
  dungeon: DungeonRecord,
  columnKey: (typeof STATIC_COLUMNS)[number]["key"],
): string {
  return String(dungeon[columnKey]);
}

function ItemLevelCell({ itemLevels }: { itemLevels: number[] }) {
  if (itemLevels.length === 0) {
    return (
      <Typography component="span" variant="body2" color="text.secondary">
        —
      </Typography>
    );
  }

  return (
    <>
      {itemLevels.map((itemLevel, index) => (
        <span key={`${itemLevel}-${index}`}>
          {index > 0 ? (
            <span className="raid-tracker-table__ilvl-separator"> / </span>
          ) : null}
          <span
            className={`raid-tracker-table__ilvl ${itemLevelTierClassName(getItemLevelTier(itemLevel))}`}
          >
            {itemLevel}
          </span>
        </span>
      ))}
    </>
  );
}

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
      const sorted = [...dungeons].sort((firstDungeon, secondDungeon) => {
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
    return sortDungeons(dungeons, sortKey, sortDirection, completionsByDungeonId);
  }, [
    characterSortDirection,
    characterSortId,
    completionsByDungeonId,
    dungeonToggles,
    dungeons,
    sortDirection,
    sortKey,
  ]);

  return (
    <TableContainer sx={{ overflowX: "auto" }}>
      <Table className="raid-tracker-table" size="small" stickyHeader>
        <TableHead>
          <TableRow>
            {STATIC_COLUMNS.map((column) => (
              <SortableHeaderCell
                key={column.key}
                label={column.label}
                sortKey={column.sortKey}
                activeSortKey={sortKey}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
            ))}
            <SortableHeaderCell
              label={COMPLETE_COLUMN.label}
              sortKey={COMPLETE_COLUMN.sortKey}
              activeSortKey={sortKey}
              sortDirection={sortDirection}
              onSort={handleSort}
              align="center"
            />
            {characters.map((character: CharacterRecord) => (
              <TableCell key={character.id} align="center">
                <Stack spacing={0.5} sx={{ alignItems: "center" }}>
                  <TableSortLabel
                    active={characterSortId === character.id}
                    direction={
                      characterSortId === character.id
                        ? characterSortDirection
                        : "asc"
                    }
                    onClick={() => {
                      handleCharacterSort(character.id);
                    }}
                    sx={{ "& .MuiTableSortLabel-icon": { marginLeft: "2px" } }}
                  >
                    <Stack
                      direction="row"
                      spacing={0.5}
                      sx={{ alignItems: "center", justifyContent: "center" }}
                    >
                      {character.class ? (
                        <Box
                          component="img"
                          src={character.class.icon}
                          alt=""
                          width={18}
                          height={18}
                          sx={{ borderRadius: "4px", flexShrink: 0 }}
                        />
                      ) : null}
                      <Typography
                        variant="caption"
                        sx={characterNameDisplaySx(character.class)}
                      >
                        {character.name}
                      </Typography>
                    </Stack>
                  </TableSortLabel>
                  <Typography variant="caption" color="text.secondary">
                    {countCompletedForCharacter(
                      character.id,
                      dungeons,
                      dungeonToggles,
                    )}
                    /{dungeonCount}
                  </Typography>
                  <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap", justifyContent: "center" }}>
                    <Button
                      size="small"
                      color="inherit"
                      onClick={() => {
                        onResetCharacterToggles(character.id);
                      }}
                      aria-label={`Reset toggles for ${character.name}`}
                    >
                      Reset
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => {
                        onDeleteCharacter(character.id);
                      }}
                    >
                      Remove
                    </Button>
                  </Stack>
                </Stack>
              </TableCell>
            ))}
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedDungeons.map((dungeon: DungeonRecord) => (
            <TableRow key={dungeon.id} hover>
              {STATIC_COLUMNS.map((column) => (
                <TableCell key={column.key}>
                  {column.key === "itemLevel" ? (
                    <ItemLevelCell itemLevels={dungeon.itemLevel} />
                  ) : (
                    formatDungeonCell(dungeon, column.key)
                  )}
                </TableCell>
              ))}
              <TableCell key={COMPLETE_COLUMN.key} align="center">
                <Typography variant="body2" color="text.secondary">
                  {completionsByDungeonId[dungeon.id] ?? 0}/{characterCount}
                </Typography>
              </TableCell>
              {characters.map((character: CharacterRecord) => (
                <TableCell key={character.id} align="center">
                  <Switch
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
              <TableCell align="right">
                <Button
                  size="small"
                  color="error"
                  onClick={() => {
                    onDeleteDungeon(dungeon.id);
                  }}
                >
                  Delete dungeon
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
