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
  TableRow,
  Typography,
} from "@mui/material";
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
import type { RaidTrackerTableProps } from "./types.ts";
import "./styles.css";

const STATIC_COLUMNS: ReadonlyArray<{
  key: keyof Pick<DungeonRecord, "name" | "size" | "difficulty" | "itemLevel">;
  label: string;
}> = [
  { key: "name", label: "Dungeon name" },
  { key: "size", label: "Size" },
  { key: "difficulty", label: "Difficulty" },
  { key: "itemLevel", label: "Item level" },
];

const COMPLETE_COLUMN = { key: "complete" as const, label: "Complete" };

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

  return (
    <TableContainer sx={{ overflowX: "auto" }}>
      <Table className="raid-tracker-table" size="small" stickyHeader>
        <TableHead>
          <TableRow>
            {STATIC_COLUMNS.map((column) => (
              <TableCell key={column.key}>{column.label}</TableCell>
            ))}
            <TableCell key={COMPLETE_COLUMN.key} align="center">
              {COMPLETE_COLUMN.label}
            </TableCell>
            {characters.map((character: CharacterRecord) => (
              <TableCell key={character.id} align="center">
                <Stack spacing={0.5} sx={{ alignItems: "center" }}>
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
          {dungeons.map((dungeon: DungeonRecord) => (
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
                  {countCompletedForDungeon(
                    dungeon.id,
                    characters,
                    dungeonToggles,
                  )}
                  /{characterCount}
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
