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
import type { RaidTrackerTableProps } from "./types.ts";

const STATIC_COLUMNS: ReadonlyArray<{
  key: keyof Pick<DungeonRecord, "name" | "size" | "difficulty" | "itemLevel">;
  label: string;
}> = [
  { key: "name", label: "Dungeon name" },
  { key: "size", label: "Size" },
  { key: "difficulty", label: "Difficulty" },
  { key: "itemLevel", label: "Item level" },
];

function formatDungeonCell(
  dungeon: DungeonRecord,
  columnKey: (typeof STATIC_COLUMNS)[number]["key"],
): string {
  if (columnKey === "itemLevel") {
    return dungeon.itemLevel.join(" / ");
  }
  return String(dungeon[columnKey]);
}

export function RaidTrackerTable({
  characters,
  dungeons,
  dungeonToggles,
  onDungeonToggle,
  onDeleteCharacter,
  onDeleteDungeon,
}: RaidTrackerTableProps) {
  return (
    <TableContainer sx={{ overflowX: "auto" }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            {STATIC_COLUMNS.map((column) => (
              <TableCell key={column.key}>{column.label}</TableCell>
            ))}
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
                  {formatDungeonCell(dungeon, column.key)}
                </TableCell>
              ))}
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
