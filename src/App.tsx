import { AppFooter } from "./components/index.ts";
import "./App.css";
import {
  // TODO error handling with Alert,
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import type { FormEvent } from "react";
import { useCallback, useMemo, useState } from "react";
import {
  Classes,
  characterNameDisplaySx,
  type CharacterClass,
  type CharacterRecord,
} from "./types/characters.ts";
import {
  DungeonDifficulty,
  DungeonSizes,
  type DungeonRecord,
  type DungeonSize,
  type DungeonToggles,
} from "./types/dungeons.ts";
import { generateUUID } from "./uuid.ts";

// TODO move to types/dungeons.ts ?
type DungeonDifficultyOption =
  (typeof DungeonDifficulty)[keyof typeof DungeonDifficulty];

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
  columnKey: (typeof STATIC_COLUMNS)[number]["key"],
): string {
  // TODO убрать отдельный формат для itemLevel ?
  if (columnKey === "itemLevel") {
    return dungeon.itemLevel.join(" / ");
  }
  return String(dungeon[columnKey]);
}

function parseItemLevelInput(text: string): number[] {
  const segments = text
  // TODO move to utils/parse-item-level-input.ts ?
  // TODO add processing of different separators like - / .. ...
    .split(/[/,]+/)
    .map((segment) => segment.trim())
    .filter(Boolean);
  return segments
    .map((segment) => Number(segment))
    .filter((value) => Number.isFinite(value));
}

function App() {
  // TODO separation of logic for forms and data handling ?
  // TODO use hooks for forms ?
  // TODO use zod for validation ?
  // TODO use state manager ?
  const [characters, setCharacters] = useState<CharacterRecord[]>([]);
  const [dungeons, setDungeons] = useState<DungeonRecord[]>([]);
  const [dungeonToggles, setDungeonToggles] = useState<DungeonToggles>({});

  const [showCharacterForm, setShowCharacterForm] = useState(false);
  const [showDungeonForm, setShowDungeonForm] = useState(false);

  const [newCharacterName, setNewCharacterName] = useState("");
  const [newCharacterClass, setNewCharacterClass] = useState<CharacterClass | "">(
    "",
  );
  const [characterFormError, setCharacterFormError] = useState("");

  const [newDungeonName, setNewDungeonName] = useState("");
  const [newDungeonSize, setNewDungeonSize] = useState<DungeonSize>(10);
  const [newDungeonItemLevelText, setNewDungeonItemLevelText] = useState("200");
  const [newDungeonDifficulty, setNewDungeonDifficulty] =
    useState<DungeonDifficultyOption>(DungeonDifficulty.NORMAL);
  const [dungeonFormError, setDungeonFormError] = useState("");

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
    [],
  );

  const handleCharacterFormSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setCharacterFormError("");
      const trimmedName = newCharacterName.trim();
      if (!trimmedName || !newCharacterClass) {
        setCharacterFormError("Enter a name and choose a class.");
        return;
      }
      const isDuplicate = characters.some(
        (existing) =>
          existing.name.toLowerCase() === trimmedName.toLowerCase() &&
          existing.class?.name === newCharacterClass.name,
      );
      if (isDuplicate) {
        setCharacterFormError(
          "A character with this name and class already exists.",
        );
        return;
      }
      const newCharacter: CharacterRecord = {
        id: generateUUID(),
        name: trimmedName,
        class: newCharacterClass,
      };
      setCharacters((previous) => [...previous, newCharacter]);

      // TODO unite as ResetFormValues ?
      setNewCharacterName("");
      setNewCharacterClass("");
      setShowCharacterForm(false);
    },
    [characters, newCharacterClass, newCharacterName],
  );

  const handleDungeonFormSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setDungeonFormError("");
      const trimmedName = newDungeonName.trim();
      if (!trimmedName) {
        setDungeonFormError("Enter a dungeon name.");
        return;
      }
      const itemLevels = parseItemLevelInput(newDungeonItemLevelText);
      if (itemLevels.length === 0) {
        setDungeonFormError(
          "Enter at least one item level (e.g. 200 or range like 200 / 213).",
        );
        return;
      }
      const newDungeon: DungeonRecord = {
        id: generateUUID(),
        name: trimmedName,
        size: newDungeonSize,
        itemLevel: itemLevels,
        difficulty: newDungeonDifficulty,
      };
      setDungeons((previous) => [...previous, newDungeon]);

      // TODO unite as ResetFormValues ?
      setNewDungeonName("");
      setNewDungeonSize(10);
      setNewDungeonItemLevelText("200");
      setNewDungeonDifficulty(DungeonDifficulty.NORMAL);
      setShowDungeonForm(false);
    },
    [
      newDungeonDifficulty,
      newDungeonItemLevelText,
      newDungeonName,
      newDungeonSize,
    ],
  );

  const handleDeleteCharacter = useCallback((characterId: string) => {
    setCharacters((previous) =>
      previous.filter((character) => character.id !== characterId),
    );
    setDungeonToggles((previous) => {
      const next = { ...previous };
      delete next[characterId];
      return next;
    });
  }, []);

  const handleDeleteDungeon = useCallback((dungeonId: string) => {
    setDungeons((previous) =>
      previous.filter((dungeon) => dungeon.id !== dungeonId),
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
        (dungeon) => togglesForCharacter[dungeon.id],
      ).length;
      return { character, completedCount };
    });

    const perDungeon = dungeons.map((dungeon) => {
      const completedCount = characters.filter(
        (character) => dungeonToggles[character.id]?.[dungeon.id],
      ).length;
      return { dungeon, completedCount };
    });

    const totalCells = characters.length * dungeons.length;
    const totalCompleted = perCharacter.reduce(
      (sum, row) => sum + row.completedCount,
      0,
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
            Self-contained demo: characters and dungeons use shared domain
            types; completion is stored in <code>DungeonToggles</code>{" "}
            (character id → dungeon id → boolean). Replace this file when you
            wire storage and hooks.
          </Typography>

          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            <Button
              variant={showCharacterForm ? "contained" : "outlined"}
              color="primary"
              aria-expanded={showCharacterForm}
              onClick={() => {
                setShowCharacterForm((previous) => !previous);
              }}
            >
              Add character
            </Button>
            <Button
              variant={showDungeonForm ? "contained" : "outlined"}
              color="primary"
              aria-expanded={showDungeonForm}
              onClick={() => {
                setShowDungeonForm((previous) => !previous);
              }}
            >
              Add dungeon
            </Button>
            <Button
              variant="outlined"
              color="warning"
              onClick={handleResetAllToggles}
            >
              Reset all toggles
            </Button>
          </Stack>

{/* TODO make a separate component for form */}
          {showCharacterForm ? (
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                New character
              </Typography>
              {/* TODO check what is noValidate doing? */}
              <form onSubmit={handleCharacterFormSubmit} noValidate>
                <Stack spacing={2} sx={{ maxWidth: 480 }}>
                  <TextField
                    label="Name"
                    name="characterName"
                    value={newCharacterName}
                    onChange={(event) => {
                      setNewCharacterName(event.target.value);
                      setCharacterFormError("");
                    }}
                    required
                    autoComplete="off"
                  />
                  <FormControl required>
                    <InputLabel id="character-class-label">Class</InputLabel>
                    <Select
                      labelId="character-class-label"
                      label="Class"
                      name="characterClass"
                      value={newCharacterClass === "" ? "" : newCharacterClass.name}
                      onChange={(event) => {
                        const selectedName = event.target.value;
                        const selectedClass = Classes.find(
                          (characterClass) => characterClass.name === selectedName,
                        );
                        setNewCharacterClass(selectedClass ?? "");
                        setCharacterFormError("");
                      }}
                    >
                      {/* TODO check if it possible to use image inside items */}
                      {Classes.map((characterClass) => (
                        <MenuItem
                          key={characterClass.name}
                          value={characterClass.name}
                        >
                          {characterClass.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button variant="contained" color="primary" type="submit">
                    Add character
                  </Button>
                  {characterFormError ? (
                    // TODO use Alert component ?
                    <Typography color="error" variant="body2">
                      {characterFormError}
                    </Typography>
                  ) : null}
                </Stack>
              </form>
            </Box>
          ) : null}

          {showDungeonForm ? (
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                New dungeon
              </Typography>
              {/* TODO check what is noValidate doing? */}
              <form onSubmit={handleDungeonFormSubmit} noValidate>
                <Stack spacing={2} sx={{ maxWidth: 480 }}>
                  <TextField
                    label="Name"
                    name="dungeonName"
                    value={newDungeonName}
                    onChange={(event) => {
                      setNewDungeonName(event.target.value);
                      setDungeonFormError("");
                    }}
                    required
                    autoComplete="off"
                  />
                  <FormControl required>
                    <InputLabel id="dungeon-size-label">Size</InputLabel>
                    <Select
                      labelId="dungeon-size-label"
                      label="Size"
                      name="dungeonSize"
                      value={newDungeonSize}
                      onChange={(event) => {
                        setNewDungeonSize(Number(event.target.value) as DungeonSize);
                        setDungeonFormError("");
                      }}
                    >
                      {/* TODO check if it possible to use image inside items */}
                      {DungeonSizes.map((sizeOption) => (
                        <MenuItem key={sizeOption} value={sizeOption}>
                          {sizeOption}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    label="Item levels"
                    name="dungeonItemLevels"
                    value={newDungeonItemLevelText}
                    onChange={(event) => {
                      setNewDungeonItemLevelText(event.target.value);
                      setDungeonFormError("");
                    }}
                    helperText="One or more values, separated by / or comma (e.g. 200 or 200 / 213)."
                    required
                    autoComplete="off"
                  />
                  <FormControl>
                    <InputLabel id="dungeon-difficulty-label">
                      Difficulty
                    </InputLabel>
                    <Select
                      labelId="dungeon-difficulty-label"
                      label="Difficulty"
                      name="dungeonDifficulty"
                      value={newDungeonDifficulty}
                      onChange={(event) => {
                        setNewDungeonDifficulty(
                          event.target.value as DungeonDifficultyOption,
                        );
                        setDungeonFormError("");
                      }}
                    >
                      <MenuItem value={DungeonDifficulty.NORMAL}>
                        {DungeonDifficulty.NORMAL}
                      </MenuItem>
                      <MenuItem value={DungeonDifficulty.HEROIC}>
                        {DungeonDifficulty.HEROIC}
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <Button variant="contained" color="primary" type="submit">
                    Add dungeon
                  </Button>
                  {dungeonFormError ? (
                    // TODO use Alert component ?
                    <Typography color="error" variant="body2">
                      {dungeonFormError}
                    </Typography>
                  ) : null}
                </Stack>
              </form>
            </Box>
          ) : null}

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Completion summary
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total: {completionSummary.totalCompleted} /{" "}
              {completionSummary.totalCells} cells marked complete
            </Typography>
            <Typography variant="body2" color="text.secondary">
              By character:{" "}
              {completionSummary.perCharacter
                .map(
                  ({ character, completedCount }) =>
                    `${character.name}: ${completedCount}/${dungeons.length}`,
                )
                .join(" · ") || "—"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              By dungeon:{" "}
              {completionSummary.perDungeon
                .map(
                  ({ dungeon, completedCount }) =>
                    `${dungeon.name}: ${completedCount}/${characters.length}`,
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
                        {/* <Typography variant="caption" color="text.secondary">
                          {character.class?.name ?? "—"}
                        </Typography> */}
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
