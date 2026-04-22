import type { ChangeEvent, MouseEvent } from "react";
import { useCallback, useMemo, useState } from "react";
import type { DungeonTableProps } from "./types";
import { CharacterHeaderCell } from "./character-header-cell";
import { DungeonCell } from "./dungeon-cell";
import type { DungeonSortKey } from "./dungeon-table-utils";
import {
  characterHasToggles,
  filterDungeonsByName,
  sortDungeons,
} from "./dungeon-table-utils";
import "./styles.css";

export function DungeonTable({
  dungeons,
  characters,
  dungeonToggles,
  onDungeonToggle,
  onDeleteDungeon,
  onAddFromTemplate,
  onResetCharacter,
  onDeleteCharacter,
}: DungeonTableProps) {
  const [sortKey, setSortKey] = useState<DungeonSortKey>("itemLevel");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [nameSearch, setNameSearch] = useState("");

  const completionCountsByDungeonId = useMemo(() => {
    const result: Record<string, number> = Object.fromEntries(
      dungeons.map((d) => [d.id, 0])
    );

    for (const character of characters) {
      const toggles = dungeonToggles[character.id];
      if (!toggles) continue;
      for (const [dungeonId, isMarked] of Object.entries(toggles)) {
        if (!isMarked) continue;
        if (result[dungeonId] === undefined) continue;
        result[dungeonId] += 1;
      }
    }
    return result;
  }, [characters, dungeons, dungeonToggles]);

  const handleToggleSortDir = useCallback(() => {
    setSortDir((d) => (d === "asc" ? "desc" : "asc"));
  }, []);

  const markedCountsByCharacterId = useMemo(() => {
    const dungeonIdSet = new Set(dungeons.map((dungeon) => dungeon.id));
    const result: Record<string, number> = {};

    for (const character of characters) {
      const toggles = dungeonToggles[character.id];
      if (!toggles) {
        result[character.id] = 0;
        continue;
      }

      let count = 0;
      for (const [dungeonId, isMarked] of Object.entries(toggles)) {
        if (isMarked && dungeonIdSet.has(dungeonId)) count += 1;
      }
      result[character.id] = count;
    }

    return result;
  }, [characters, dungeons, dungeonToggles]);

  const characterIdsWithAnyToggle = useMemo(() => {
    const result = new Set<string>();
    for (const char of characters) {
      const toggles = dungeonToggles[char.id];
      if (characterHasToggles(toggles)) result.add(char.id);
    }
    return result;
  }, [characters, dungeonToggles]);

  const visibleDungeons = useMemo(
    () =>
      sortDungeons(
        filterDungeonsByName(dungeons, nameSearch),
        sortKey,
        sortDir,
        completionCountsByDungeonId
      ),
    [dungeons, nameSearch, sortKey, sortDir, completionCountsByDungeonId]
  );

  const colSpan = 1 + characters.length;
  const hasDungeons = dungeons.length > 0;
  const hasVisibleRows = visibleDungeons.length > 0;

  const handleToggleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const characterId = event.currentTarget.dataset.characterId;
      const dungeonId = event.currentTarget.dataset.dungeonId;
      if (!characterId || !dungeonId) return;
      onDungeonToggle(characterId, dungeonId);
    },
    [onDungeonToggle]
  );

  const handleDeleteDungeonClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const dungeonId = event.currentTarget.dataset.dungeonId;
      if (!dungeonId) return;
      onDeleteDungeon(dungeonId);
    },
    [onDeleteDungeon]
  );

  const handleResetCharacterClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const characterId = event.currentTarget.dataset.characterId;
      if (!characterId) return;
      onResetCharacter(characterId);
    },
    [onResetCharacter]
  );

  const handleDeleteCharacterClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const characterId = event.currentTarget.dataset.characterId;
      if (!characterId) return;
      onDeleteCharacter(characterId);
    },
    [onDeleteCharacter]
  );

  return (
    <div className="dungeon-table-container">
      <table className="dungeon-table" aria-label="Dungeon cooldown tracker">
      <thead>
        <tr>
          <th scope="col" className="dungeon-table-sticky-col">
            <div className="dungeon-table-dungeon-header">
              <div className="dungeon-table-dungeon-header-row">
                <span className="dungeon-table-dungeon-header-label">Dungeon</span>
                <div className="dungeon-table-sort">
                  <select
                    id="dungeon-sort"
                    className="dungeon-table-sort-select"
                    value={sortKey}
                    onChange={(event) =>
                      setSortKey(event.target.value as DungeonSortKey)
                    }
                    aria-label="Sort dungeons by"
                  >
                    <option value="name">Name</option>
                    <option value="size">Size</option>
                    <option value="itemLevel">Item level</option>
                    <option value="completions">Completions</option>
                  </select>
                  <button
                    type="button"
                    className="dungeon-table-sort-dir-btn"
                    onClick={handleToggleSortDir}
                    aria-label={`Sort ${sortDir === "asc" ? "ascending" : "descending"}`}
                    title={sortDir === "asc" ? "Ascending (click for descending)" : "Descending (click for ascending)"}
                  >
                    {sortDir === "asc" ? "↑" : "↓"}
                  </button>
                </div>
              </div>
              <input
                id="dungeon-name-search"
                type="search"
                className="dungeon-table-name-search"
                value={nameSearch}
                onChange={(event) => setNameSearch(event.target.value)}
                placeholder="Search name…"
                aria-label="Filter dungeons by name"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          </th>
          {characters.map((char) => {
            const hasToggles = characterIdsWithAnyToggle.has(char.id);
            const markedCount = markedCountsByCharacterId[char.id] ?? 0;
            return (
              <th key={char.id} scope="col">
                <CharacterHeaderCell
                  character={char}
                  hasToggles={hasToggles}
                  markedCount={markedCount}
                  onResetCharacterClick={handleResetCharacterClick}
                  onDeleteCharacterClick={handleDeleteCharacterClick}
                />
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {!hasDungeons ? (
          <tr>
            <td colSpan={colSpan} className="dungeon-table-empty-state">
              <span className="dungeon-table-empty-text">Add a dungeon to track</span>
              {onAddFromTemplate && (
                <button
                  type="button"
                  className="add-from-template-btn"
                  onClick={onAddFromTemplate}
                >
                  Add from template
                </button>
              )}
            </td>
          </tr>
        ) : !hasVisibleRows ? (
          <tr>
            <td
              colSpan={colSpan}
              className="dungeon-table-empty-state dungeon-table-empty-state--filter"
            >
              <span className="dungeon-table-empty-text">
                No dungeons match this search
              </span>
            </td>
          </tr>
        ) : (
          visibleDungeons.map((dungeon) => (
          <tr key={dungeon.id}>
            <td className="dungeon-table-sticky-col">
              <DungeonCell
                dungeon={dungeon}
                completionCount={completionCountsByDungeonId[dungeon.id] ?? 0}
                onDeleteDungeonClick={handleDeleteDungeonClick}
              />
            </td>
            {characters.map((char) => (
              <td key={char.id} className="dungeon-table-character-cell">
                <label className="dungeon-toggle">
                  <input
                    type="checkbox"
                    checked={dungeonToggles[char.id]?.[dungeon.id] ?? false}
                    data-character-id={char.id}
                    data-dungeon-id={dungeon.id}
                    onChange={handleToggleChange}
                    aria-label={`${char.name} - ${dungeon.name}`}
                  />
                  <span className="dungeon-toggle-slider" />
                </label>
              </td>
            ))}
          </tr>
          ))
        )}
      </tbody>
    </table>
    </div>
  );
}
