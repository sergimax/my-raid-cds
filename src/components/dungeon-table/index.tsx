import type { ChangeEvent, MouseEvent } from "react";
import { useCallback, useMemo, useState } from "react";
import type { DungeonTableProps } from "./types";
import { DungeonMode } from "../../types/dungeons";
import { CharacterHeaderCell } from "./character-header-cell";
import { DungeonCell } from "./dungeon-cell";
import type { DungeonSortKey } from "./dungeon-table-utils";
import {
  characterHasToggles,
  filterDungeonsByName,
  sortDungeons,
} from "./dungeon-table-utils";
import "./styles.css";

type DungeonSortKeyDungeonSelect = Exclude<DungeonSortKey, "size" | "mode">;

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

  const handleSizeSortClick = useCallback(() => {
    if (sortKey !== "size") {
      setSortKey("size");
      setSortDir("desc");
    } else {
      handleToggleSortDir();
    }
  }, [sortKey, handleToggleSortDir]);

  const handleModeSortClick = useCallback(() => {
    if (sortKey !== "mode") {
      setSortKey("mode");
      setSortDir("desc");
    } else {
      handleToggleSortDir();
    }
  }, [sortKey, handleToggleSortDir]);

  const handleDungeonSortKeyChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const nextKey = event.target.value as
        | DungeonSortKeyDungeonSelect
        | "__size__"
        | "__mode__";
      if (nextKey === "__size__" || nextKey === "__mode__") return;
      setSortKey(nextKey as DungeonSortKey);
    },
    []
  );

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

  const colSpan = 3 + characters.length;
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
          <th scope="col" className="dungeon-table-size-col">
            <div className="dungeon-table-size-header">
              <span className="dungeon-table-size-header-label">Size</span>
              <button
                type="button"
                className={`dungeon-table-sort-dir-btn dungeon-table-size-sort-dir-btn${
                  sortKey === "size" ? " dungeon-table-size-sort-dir-btn--active" : ""
                }`}
                onClick={handleSizeSortClick}
                aria-label={
                  sortKey === "size"
                    ? `Raid size: sort ${sortDir === "asc" ? "ascending" : "descending"}`
                    : "Sort by raid size (10 / 25 / …)"
                }
                title={
                  sortKey === "size"
                    ? sortDir === "asc"
                      ? "Ascending by size (click for descending)"
                      : "Descending by size (click for ascending)"
                    : "Sort by raid size"
                }
              >
                {sortKey === "size" ? (sortDir === "asc" ? "↑" : "↓") : "↓"}
              </button>
            </div>
          </th>
          <th scope="col" className="dungeon-table-mode-col">
            <div className="dungeon-table-mode-header">
              <span className="dungeon-table-mode-header-label">Mode</span>
              <button
                type="button"
                className={`dungeon-table-sort-dir-btn dungeon-table-mode-sort-dir-btn${
                  sortKey === "mode" ? " dungeon-table-mode-sort-dir-btn--active" : ""
                }`}
                onClick={handleModeSortClick}
                aria-label={
                  sortKey === "mode"
                    ? `Difficulty: sort ${sortDir === "asc" ? "ascending" : "descending"}`
                    : "Sort by mode (Normal / Heroic)"
                }
                title={
                  sortKey === "mode"
                    ? sortDir === "asc"
                      ? "Ascending: Normal then Heroic (click for descending)"
                      : "Descending: Heroic then Normal (click for ascending)"
                    : "Sort by mode"
                }
              >
                {sortKey === "mode" ? (sortDir === "asc" ? "↑" : "↓") : "↓"}
              </button>
            </div>
          </th>
          <th scope="col" className="dungeon-table-sticky-col">
            <div className="dungeon-table-dungeon-header">
              <div className="dungeon-table-dungeon-header-row">
                <span className="dungeon-table-dungeon-header-label">Dungeon</span>
                <div className="dungeon-table-sort">
                  <select
                    id="dungeon-sort"
                    className="dungeon-table-sort-select"
                    value={
                      sortKey === "size"
                        ? "__size__"
                        : sortKey === "mode"
                          ? "__mode__"
                          : sortKey
                    }
                    onChange={handleDungeonSortKeyChange}
                    aria-label="Sort dungeons by"
                  >
                    <option value="__size__" hidden>
                      —
                    </option>
                    <option value="__mode__" hidden>
                      —
                    </option>
                    <option value="name">Name</option>
                    <option value="itemLevel">Item level</option>
                    <option value="completions">Completions</option>
                  </select>
                  {sortKey !== "size" && sortKey !== "mode" ? (
                    <button
                      type="button"
                      className="dungeon-table-sort-dir-btn"
                      onClick={handleToggleSortDir}
                      aria-label={`Sort ${sortDir === "asc" ? "ascending" : "descending"}`}
                      title={
                        sortDir === "asc"
                          ? "Ascending (click for descending)"
                          : "Descending (click for ascending)"
                      }
                    >
                      {sortDir === "asc" ? "↑" : "↓"}
                    </button>
                  ) : null}
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
            <td className="dungeon-table-size-col">{dungeon.size}</td>
            <td className="dungeon-table-mode-col">
              <span
                className={`dungeon-mode dungeon-mode--${
                  dungeon.mode === DungeonMode.HEROIC ? "heroic" : "normal"
                }`}
              >
                {dungeon.mode}
              </span>
            </td>
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
