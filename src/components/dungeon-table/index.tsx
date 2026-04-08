import type { ChangeEvent, MouseEvent } from "react";
import { useCallback, useMemo, useState } from "react";
import { formatRaidNameRuWithEn } from "../../data/dungeons.ts";
import { DungeonMode } from "../../types/dungeons.ts";
import type { DungeonRecord } from "../../types/dungeons.ts";
import type { DungeonTableProps } from "./types";
import "./styles.css";

export type DungeonSortKey = "name" | "size" | "itemLevel";

/** GearScore-style ilvl tiers (thresholds descending; tier 1 = below 200). */
const ILVL_TIER_THRESHOLDS = [
  277, 264, 258, 251, 245, 232, 226, 219, 213, 200,
] as const;

function getItemLevelTier(itemLevel: number[]): number {
  if (itemLevel.length === 0) return 1;
  const max = Math.max(...itemLevel);
  const i = ILVL_TIER_THRESHOLDS.findIndex((t) => max >= t);
  return i === -1 ? 1 : ILVL_TIER_THRESHOLDS.length + 1 - i;
}

function getMaxItemLevel(dungeon: DungeonRecord): number {
  return dungeon.itemLevel.length > 0 ? Math.max(...dungeon.itemLevel) : 0;
}

function filterDungeonsByName(list: DungeonRecord[], query: string): DungeonRecord[] {
  const q = query.trim().toLowerCase();
  if (q === "") return list;
  return list.filter((dungeon) => dungeon.name.toLowerCase().includes(q));
}

function sortDungeons(
  list: DungeonRecord[],
  key: DungeonSortKey,
  dir: "asc" | "desc"
): DungeonRecord[] {
  const maxIlvlCache = key === "itemLevel" ? new Map<string, number>() : null;
  const getCachedMaxItemLevel = (dungeon: DungeonRecord): number => {
    if (!maxIlvlCache) return getMaxItemLevel(dungeon);
    const existing = maxIlvlCache.get(dungeon.id);
    if (existing !== undefined) return existing;
    const computed = getMaxItemLevel(dungeon);
    maxIlvlCache.set(dungeon.id, computed);
    return computed;
  };

  const sorted = [...list].sort((firstDungeon, secondDungeon) => {
    let cmp = 0;
    if (key === "name") {
      cmp =
        firstDungeon.name.localeCompare(secondDungeon.name) ||
        firstDungeon.size - secondDungeon.size;
    } else if (key === "size") {
      cmp =
        firstDungeon.size - secondDungeon.size ||
        firstDungeon.name.localeCompare(secondDungeon.name);
    } else if (key === "itemLevel") {
      cmp =
        getCachedMaxItemLevel(firstDungeon) -
          getCachedMaxItemLevel(secondDungeon) ||
        firstDungeon.name.localeCompare(secondDungeon.name);
    }
    return dir === "asc" ? cmp : -cmp;
  });
  return sorted;
}

function dungeonCellTitle(dungeon: DungeonRecord): string {
  const name = formatRaidNameRuWithEn(dungeon.name);
  return dungeon.itemLevel.length > 0
    ? `${name} — Item level: ${dungeon.itemLevel.join(", ")}`
    : `${name} — Item level not set`;
}

function characterHasToggles(
  toggles: Record<string, boolean> | undefined
): boolean {
  return toggles ? Object.values(toggles).some(Boolean) : false;
}

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

  const handleToggleSortDir = useCallback(() => {
    setSortDir((d) => (d === "asc" ? "desc" : "asc"));
  }, []);

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
        sortDir
      ),
    [dungeons, nameSearch, sortKey, sortDir]
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
            return (
              <th key={char.id} scope="col">
                <div className="dungeon-table-character-header">
                  <div className="dungeon-table-character-header-name">
                    {char.class && (
                      <img src={char.class.icon} alt="" className="class-icon" />
                    )}
                    <span
                      className="dungeon-table-character-name"
                      style={{
                        color: char.class?.color ? `#${char.class.color}` : undefined,
                      }}
                    >
                      {char.name}
                    </span>
                  </div>
                  <div className="dungeon-table-character-header-actions">
                    <button
                      type="button"
                      className={`reset-character-btn ${!hasToggles ? "reset-btn--inactive" : ""}`}
                      data-character-id={char.id}
                      onClick={handleResetCharacterClick}
                      disabled={!hasToggles}
                      aria-label={`Reset ${char.name}`}
                    >
                      🔄
                    </button>
                    <button
                      type="button"
                      className="delete-character-btn"
                      data-character-id={char.id}
                      onClick={handleDeleteCharacterClick}
                      aria-label={`Delete ${char.name}`}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
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
              <div
                className="dungeon-table-dungeon-cell"
                title={dungeonCellTitle(dungeon)}
              >
                <div className="dungeon-table-dungeon-cell-text">
                  <span
                    className={`dungeon-mode dungeon-mode--${
                      dungeon.mode === DungeonMode.HEROIC ? "heroic" : "normal"
                    }`}
                  >
                    {dungeon.size}
                  </span>
                  <span
                    className={`dungeon-name dungeon-name--tier-${getItemLevelTier(dungeon.itemLevel)}`}
                  >
                    {dungeon.name}
                  </span>
                </div>
                <button
                  type="button"
                  className="delete-dungeon-btn"
                  data-dungeon-id={dungeon.id}
                  onClick={handleDeleteDungeonClick}
                  aria-label={`Delete ${dungeon.name}`}
                >
                  🗑️
                </button>
              </div>
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
