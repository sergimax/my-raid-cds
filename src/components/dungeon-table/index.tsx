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
  getItemLevelTier,
  getStartingItemLevel,
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

  const handleNameSortClick = useCallback(() => {
    if (sortKey !== "name") {
      setSortKey("name");
      setSortDir("asc");
    } else {
      handleToggleSortDir();
    }
  }, [sortKey, handleToggleSortDir]);

  const handleItemLevelSortClick = useCallback(() => {
    if (sortKey !== "itemLevel") {
      setSortKey("itemLevel");
      setSortDir("desc");
    } else {
      handleToggleSortDir();
    }
  }, [sortKey, handleToggleSortDir]);

  const handleCompletionsSortClick = useCallback(() => {
    if (sortKey !== "completions") {
      setSortKey("completions");
      setSortDir("desc");
    } else {
      handleToggleSortDir();
    }
  }, [sortKey, handleToggleSortDir]);

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

  const colSpan = 5 + characters.length;
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
          <th scope="col" className="dungeon-table-completions-col">
            <div className="dungeon-table-completions-header">
              <span className="dungeon-table-completions-header-label">
                Completions
              </span>
              <button
                type="button"
                className={`dungeon-table-sort-dir-btn dungeon-table-completions-sort-dir-btn${
                  sortKey === "completions"
                    ? " dungeon-table-completions-sort-dir-btn--active"
                    : ""
                }`}
                onClick={handleCompletionsSortClick}
                aria-label={
                  sortKey === "completions"
                    ? `Completions: sort ${sortDir === "asc" ? "ascending" : "descending"}`
                    : "Sort by completion count"
                }
                title={
                  sortKey === "completions"
                    ? sortDir === "asc"
                      ? "Ascending by completions (click for descending)"
                      : "Descending by completions (click for ascending)"
                    : "Sort by completions"
                }
              >
                {sortKey === "completions" ? (sortDir === "asc" ? "↑" : "↓") : "↓"}
              </button>
            </div>
          </th>
          <th scope="col" className="dungeon-table-ilvl-col">
            <div className="dungeon-table-ilvl-header">
              <span className="dungeon-table-ilvl-header-label">ilvl</span>
              <button
                type="button"
                className={`dungeon-table-sort-dir-btn dungeon-table-ilvl-sort-dir-btn${
                  sortKey === "itemLevel"
                    ? " dungeon-table-ilvl-sort-dir-btn--active"
                    : ""
                }`}
                onClick={handleItemLevelSortClick}
                aria-label={
                  sortKey === "itemLevel"
                    ? `Starting item level: sort ${sortDir === "asc" ? "ascending" : "descending"}`
                    : "Sort by starting item level"
                }
                title={
                  sortKey === "itemLevel"
                    ? sortDir === "asc"
                      ? "Ascending by starting ilvl (click for descending)"
                      : "Descending by starting ilvl (click for ascending)"
                    : "Sort by starting item level"
                }
              >
                {sortKey === "itemLevel" ? (sortDir === "asc" ? "↑" : "↓") : "↓"}
              </button>
            </div>
          </th>
          <th scope="col" className="dungeon-table-sticky-col">
            <div className="dungeon-table-dungeon-header">
              <div className="dungeon-table-dungeon-header-row">
                <span className="dungeon-table-dungeon-header-label">Dungeon</span>
                <div className="dungeon-table-sort dungeon-table-name-sort">
                  <span className="dungeon-table-name-sort-label">Name</span>
                  <button
                    type="button"
                    className={`dungeon-table-sort-dir-btn dungeon-table-name-sort-dir-btn${
                      sortKey === "name" ? " dungeon-table-name-sort-dir-btn--active" : ""
                    }`}
                    onClick={handleNameSortClick}
                    aria-label={
                      sortKey === "name"
                        ? `Dungeon name: sort ${sortDir === "asc" ? "ascending" : "descending"}`
                        : "Sort by dungeon name"
                    }
                    title={
                      sortKey === "name"
                        ? sortDir === "asc"
                          ? "Ascending A–Z (click for descending)"
                          : "Descending Z–A (click for ascending)"
                        : "Sort by name"
                    }
                  >
                    {sortKey === "name" ? (sortDir === "asc" ? "↑" : "↓") : "↑"}
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
          visibleDungeons.map((dungeon) => {
            const completionCount =
              completionCountsByDungeonId[dungeon.id] ?? 0;
            const startingIlvl = getStartingItemLevel(dungeon);
            return (
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
                <td className="dungeon-table-completions-col">
                  <span
                    className="dungeon-table-dungeon-count"
                    data-empty={completionCount === 0}
                    aria-label={`${dungeon.name}: ${completionCount} completions`}
                    title={`${completionCount} completions`}
                  >
                    {completionCount}
                  </span>
                </td>
                <td className="dungeon-table-ilvl-col">
                  {startingIlvl > 0 ? (
                    <span
                      className={`dungeon-table-ilvl-value dungeon-name dungeon-name--tier-${getItemLevelTier(
                        dungeon.itemLevel
                      )}`}
                    >
                      {startingIlvl}
                    </span>
                  ) : (
                    <span
                      className="dungeon-table-ilvl-empty"
                      aria-label="Item level not set"
                    >
                      —
                    </span>
                  )}
                </td>
                <td className="dungeon-table-sticky-col">
                  <DungeonCell
                    dungeon={dungeon}
                    completionCount={completionCount}
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
            );
          })
        )}
      </tbody>
    </table>
    </div>
  );
}
