import {
  AppFooter,
  AppHeader,
  AppIntro,
  CharacterForm,
  CompletionSummary,
  DungeonForm,
  RaidTrackerTable,
  TrackerControls,
} from "./components/index.ts";
import "./App.css";
import { Container, Stack } from "@mui/material";
import type { FormEvent } from "react";
import { useCallback, useMemo, useState } from "react";
import type { CompletionSummaryData } from "./components/completion-summary/types.ts";
import {
  type CharacterClass,
  type CharacterRecord,
} from "./types/characters.ts";
import {
  DungeonDifficulty,
  type DungeonDifficulty as DungeonDifficultyValue,
  type DungeonRecord,
  type DungeonSize,
  type DungeonToggles,
} from "./types/dungeons.ts";
import { parseItemLevelInput } from "./utils/parse-item-level-input.ts";
import { generateUUID } from "./uuid.ts";

function App() {
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
    useState<DungeonDifficultyValue>(DungeonDifficulty.NORMAL);
  const [dungeonFormError, setDungeonFormError] = useState("");

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

  const completionSummary = useMemo((): CompletionSummaryData => {
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
          <AppHeader />
          <AppIntro />

          <TrackerControls
            showCharacterForm={showCharacterForm}
            showDungeonForm={showDungeonForm}
            onToggleCharacterForm={() => {
              setShowCharacterForm((previous) => !previous);
            }}
            onToggleDungeonForm={() => {
              setShowDungeonForm((previous) => !previous);
            }}
            onResetAllToggles={handleResetAllToggles}
          />

          {showCharacterForm ? (
            <CharacterForm
              name={newCharacterName}
              characterClass={newCharacterClass}
              error={characterFormError}
              onNameChange={(name: string) => {
                setNewCharacterName(name);
                setCharacterFormError("");
              }}
              onClassChange={(characterClass: CharacterClass | "") => {
                setNewCharacterClass(characterClass);
                setCharacterFormError("");
              }}
              onSubmit={handleCharacterFormSubmit}
            />
          ) : null}

          {showDungeonForm ? (
            <DungeonForm
              name={newDungeonName}
              size={newDungeonSize}
              itemLevelText={newDungeonItemLevelText}
              difficulty={newDungeonDifficulty}
              error={dungeonFormError}
              onNameChange={(name: string) => {
                setNewDungeonName(name);
                setDungeonFormError("");
              }}
              onSizeChange={(size: DungeonSize) => {
                setNewDungeonSize(size);
                setDungeonFormError("");
              }}
              onItemLevelTextChange={(text: string) => {
                setNewDungeonItemLevelText(text);
                setDungeonFormError("");
              }}
              onDifficultyChange={(difficulty: DungeonDifficultyValue) => {
                setNewDungeonDifficulty(difficulty);
                setDungeonFormError("");
              }}
              onSubmit={handleDungeonFormSubmit}
            />
          ) : null}

          <CompletionSummary
            summary={completionSummary}
            characterCount={characters.length}
            dungeonCount={dungeons.length}
          />

          <RaidTrackerTable
            characters={characters}
            dungeons={dungeons}
            dungeonToggles={dungeonToggles}
            onDungeonToggle={handleDungeonToggle}
            onDeleteCharacter={handleDeleteCharacter}
            onDeleteDungeon={handleDeleteDungeon}
          />
        </Stack>
      </Container>

      <AppFooter />
    </div>
  );
}

export default App;
