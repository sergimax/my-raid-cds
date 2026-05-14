import { AppFooter } from "./components/index.ts";
import "./App.css";
import {
  Box,
  Button,
  Container,
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
import { useCallback, useMemo, useState } from "react";
import {
  Classes,
  ClassName,
  type CharacterRecord,
} from "./types/characters.ts";
import {
  DungeonDifficulty,
  type DungeonRecord,
  type DungeonSize,
  type DungeonToggles,
} from "./types/dungeons.ts";
import { generateUUID } from "./uuid.ts";

/** Static columns for the dungeon table. */
const STATIC_COLUMNS: ReadonlyArray<{
  key: keyof Pick<DungeonRecord, "name" | "size" | "difficulty" | "itemLevel">;
  label: string;
}> = [
  { key: "name", label: "Dungeon name" },
  { key: "size", label: "Size" },
  { key: "difficulty", label: "Difficulty" },
  { key: "itemLevel", label: "Item level" },
];

/**
 * Format a dungeon cell value based on the column key.
 * @param dungeon - The dungeon to format.
 * @param columnKey - The column key to format.
 * @returns The formatted value.
 */
function formatDungeonCell(
  dungeon: DungeonRecord,
  columnKey: (typeof STATIC_COLUMNS)[number]["key"]
): string {
  // TODO убрать отдельный формат для itemLevel ?
  if (columnKey === "itemLevel") {
    return dungeon.itemLevel.join(" / ");
  }
  return String(dungeon[columnKey]);
}

/**
 * Create a sample character.
 * @param existingCount - The number of existing characters.
 * @returns The sample character.
 * 
 * TODO убрать из финального кода
 */
function createSampleCharacter(existingCount: number): CharacterRecord {
  const warriorClass = Classes.find(
    (characterClass) => characterClass.name === ClassName.Warrior
  )!;
  return {
    id: generateUUID(),
    name: `Character ${existingCount + 1}`,
    class: warriorClass,
  };
}

/**
 * Create a sample dungeon.
 * @returns The sample dungeon.
 * 
 * TODO убрать из финального кода
 */
function createSampleDungeon(): DungeonRecord {
  return {
    id: generateUUID(),
    name: "Наксрамас",
    size: 10 as DungeonSize,
    itemLevel: [200],
    difficulty: DungeonDifficulty.NORMAL,
  };
}

function App() {
  const [characters, setCharacters] = useState<CharacterRecord[]>(() => [
    createSampleCharacter(0),
  ]);
  const [dungeons, setDungeons] = useState<DungeonRecord[]>(() => [
    createSampleDungeon(),
  ]);
  const [dungeonToggles, setDungeonToggles] = useState<DungeonToggles>({});

  /**
   * Handle dungeon toggle.
   * @param characterId - The id of the character.
   * @param dungeonId - The id of the dungeon.
   */
  const handleDungeonToggle = useCallback(
    (characterId: string, dungeonId: string) => {
      setDungeonToggles((previous) => {
        const previousForCharacter = previous[characterId] ?? {};
        const nextValue = !(previousForCharacter[dungeonId] ?? false);
        return {
          ...previous,
          [characterId]: {
            ...previousForCharacter,
            [dungeonId]: nextValue,
          },
        };
      });
    },
    []
  );

  const handleAddCharacter = useCallback(() => {
    // TODO добавить валидацию на уникальность имени и класса
    // TODO добавить сохранение в localStorage
    // TODO использовать данные с формы
    setCharacters((previous) => [...previous, createSampleCharacter(previous.length)]);
  }, []);

  const handleAddDungeon = useCallback(() => {
    // TODO добавить валидацию на уникальность имени и класса
    // TODO добавить сохранение в localStorage
    // TODO использовать данные с формы
    setDungeons((previous) => [...previous, createSampleDungeon()]);
  }, []);

  const handleDeleteCharacter = useCallback((characterId: string) => {
    setCharacters((previous) =>
      previous.filter((character) => character.id !== characterId)
    );
    setDungeonToggles((previous) => {
      const next = { ...previous };
      delete next[characterId];
      return next;
    });
  }, []);

  const handleDeleteDungeon = useCallback((dungeonId: string) => {
    setDungeons((previous) =>
      previous.filter((dungeon) => dungeon.id !== dungeonId)
    );
    setDungeonToggles((previous) => {
      const next: DungeonToggles = {};
      for (const [characterId, togglesByDungeon] of Object.entries(previous)) {
        const nextForCharacter = { ...togglesByDungeon };
        delete nextForCharacter[dungeonId];
        next[characterId] = nextForCharacter;
      }
      return next;
    });
  }, []);

  const handleResetAllToggles = useCallback(() => {
    setDungeonToggles({});
  }, []);

  /**
   * Calculate the completion summary.
   */
  const completionSummary = useMemo(() => {
    const perCharacter = characters.map((character) => {
      const togglesForCharacter = dungeonToggles[character.id] ?? {};
      const completedCount = dungeons.filter(
        (dungeon) => togglesForCharacter[dungeon.id]
      ).length;
      return { character, completedCount };
    });

    const perDungeon = dungeons.map((dungeon) => {
      const completedCount = characters.filter(
        (character) => dungeonToggles[character.id]?.[dungeon.id]
      ).length;
      return { dungeon, completedCount };
    });

    const totalCells = characters.length * dungeons.length;
    const totalCompleted = perCharacter.reduce(
      (sum, row) => sum + row.completedCount,
      0
    );

    return { perCharacter, perDungeon, totalCells, totalCompleted };
  }, [characters, dungeons, dungeonToggles]);

  return (
    <div className="app-shell">
      <Container className="app-main" component="main" maxWidth="lg">
        <Stack spacing={2}>
          <Typography component="h1" variant="h4">
            My Raid CDs
          </Typography>
          <Typography color="text.secondary" variant="body1">
            Self-contained demo: characters and dungeons use shared domain types;
            completion is stored in <code>DungeonToggles</code> (character id →
            dungeon id → boolean). Replace this file when you wire storage and
            hooks.
          </Typography>

          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            <Button variant="contained" color="primary" onClick={handleAddCharacter}>
              Add character
            </Button>
            <Button variant="contained" color="primary" onClick={handleAddDungeon}>
              Add dungeon
            </Button>
            <Button variant="outlined" color="warning" onClick={handleResetAllToggles}>
              Reset all toggles
            </Button>
          </Stack>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Completion summary
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total: {completionSummary.totalCompleted} / {completionSummary.totalCells}{" "}
              cells marked complete
            </Typography>
            <Typography variant="body2" color="text.secondary">
              By character:{" "}
              {completionSummary.perCharacter
                .map(
                  ({ character, completedCount }) =>
                    `${character.name}: ${completedCount}/${dungeons.length}`
                )
                .join(" · ") || "—"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              By dungeon:{" "}
              {completionSummary.perDungeon
                .map(
                  ({ dungeon, completedCount }) =>
                    `${dungeon.name}: ${completedCount}/${characters.length}`
                )
                .join(" · ") || "—"}
            </Typography>
          </Box>

          <TableContainer sx={{ overflowX: "auto" }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  {STATIC_COLUMNS.map((column) => (
                    <TableCell key={column.key}>{column.label}</TableCell>
                  ))}
                  {characters.map((character) => (
                    <TableCell key={character.id} align="center">
                      <Stack spacing={0.5} sx={{ alignItems: "center" }}>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {character.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {character.class?.name ?? "—"}
                        </Typography>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => {
                            handleDeleteCharacter(character.id);
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
                {dungeons.map((dungeon) => (
                  <TableRow key={dungeon.id} hover>
                    {STATIC_COLUMNS.map((column) => (
                      <TableCell key={column.key}>
                        {formatDungeonCell(dungeon, column.key)}
                      </TableCell>
                    ))}
                    {characters.map((character) => (
                      <TableCell key={character.id} align="center">
                        <Switch
                          checked={
                            dungeonToggles[character.id]?.[dungeon.id] ?? false
                          }
                          onChange={() => {
                            handleDungeonToggle(character.id, dungeon.id);
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
                          handleDeleteDungeon(dungeon.id);
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
        </Stack>
      </Container>

      <AppFooter />
    </div>
  );
}

export default App;
