import { useState, useMemo } from "react";
import { formatRaidNameRuWithEn } from "../../data/dungeons.ts";
import { DungeonMode } from "../../types/dungeons.ts";
import type { DungeonRecord } from "../../types/dungeons.ts";
import type { DungeonTableProps } from "./types";
import "./styles.css";

export type DungeonSortKey = "name" | "size" | "itemLevel";

/** GearScore-style ilvl tiers: 200, 213, 219, 226, 232, 245, 251, 258, 264, 277, 284 (max). */
function getItemLevelTier(itemLevel: number[]): number {
  if (itemLevel.length === 0) return 1;
  const max = Math.max(...itemLevel);
  if (max >= 277) return 11;
  if (max >= 264) return 10;
  if (max >= 258) return 9;
  if (max >= 251) return 8;
  if (max >= 245) return 7;
  if (max >= 232) return 6;
  if (max >= 226) return 5;
  if (max >= 219) return 4;
  if (max >= 213) return 3;
  if (max >= 200) return 2;
  return 1; /* < 200: dungeons, previous patches */
}

function getMaxItemLevel(d: DungeonRecord): number {
  return d.itemLevel.length > 0 ? Math.max(...d.itemLevel) : 0;
}

function filterDungeonsByName(list: DungeonRecord[], query: string): DungeonRecord[] {
  const q = query.trim().toLowerCase();
  if (q === "") return list;
  return list.filter((d) => d.name.toLowerCase().includes(q));
}

function sortDungeons(
  list: DungeonRecord[],
  key: DungeonSortKey,
  dir: "asc" | "desc"
): DungeonRecord[] {
  const sorted = [...list].sort((a, b) => {
    let cmp = 0;
    if (key === "name") {
      cmp = a.name.localeCompare(b.name) || a.size - b.size;
    } else if (key === "size") {
      cmp = a.size - b.size || a.name.localeCompare(b.name);
    } else if (key === "itemLevel") {
      cmp = getMaxItemLevel(a) - getMaxItemLevel(b) || a.name.localeCompare(b.name);
    }
    return dir === "asc" ? cmp : -cmp;
  });
  return sorted;
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

  const filteredDungeons = useMemo(
    () => filterDungeonsByName(dungeons, nameSearch),
    [dungeons, nameSearch]
  );

  const sortedDungeons = useMemo(
    () => sortDungeons(filteredDungeons, sortKey, sortDir),
    [filteredDungeons, sortKey, sortDir]
  );

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as DungeonSortKey;
    setSortKey(value);
  };

  const cycleSortDir = () => {
    setSortDir((d) => (d === "asc" ? "desc" : "asc"));
  };

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
                    onChange={handleSortChange}
                    aria-label="Sort dungeons by"
                  >
                    <option value="name">Name</option>
                    <option value="size">Size</option>
                    <option value="itemLevel">Item level</option>
                  </select>
                  <button
                    type="button"
                    className="dungeon-table-sort-dir-btn"
                    onClick={cycleSortDir}
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
                onChange={(e) => setNameSearch(e.target.value)}
                placeholder="Search name…"
                aria-label="Filter dungeons by name"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          </th>
          {characters.map((char) => {
            const hasToggles = Object.values(
              dungeonToggles[char.id] ?? {}
            ).some(Boolean);
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
                      onClick={() => onResetCharacter(char.id)}
                      disabled={!hasToggles}
                      aria-label={`Reset ${char.name}`}
                    >
                      🔄
                    </button>
                    <button
                      type="button"
                      className="delete-character-btn"
                      onClick={() => onDeleteCharacter(char.id)}
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
        {dungeons.length === 0 ? (
          <tr>
            <td
              colSpan={1 + characters.length}
              className="dungeon-table-empty-state"
            >
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
        ) : filteredDungeons.length === 0 ? (
          <tr>
            <td
              colSpan={1 + characters.length}
              className="dungeon-table-empty-state dungeon-table-empty-state--filter"
            >
              <span className="dungeon-table-empty-text">No dungeons match this search</span>
            </td>
          </tr>
        ) : (
          sortedDungeons.map((dungeon) => (
          <tr key={dungeon.id}>
            <td className="dungeon-table-sticky-col">
              <div
                className="dungeon-table-dungeon-cell"
                title={
                  dungeon.itemLevel.length > 0
                    ? `${formatRaidNameRuWithEn(dungeon.name)} — Item level: ${dungeon.itemLevel.join(", ")}`
                    : `${formatRaidNameRuWithEn(dungeon.name)} — Item level not set`
                }
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
                  onClick={() => onDeleteDungeon(dungeon.id)}
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
                    onChange={() => onDungeonToggle(char.id, dungeon.id)}
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
