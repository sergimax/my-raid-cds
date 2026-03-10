import { useState, useMemo } from "react";
import { DungeonMode } from "../../types/dungeons.ts";
import type { DungeonRecord } from "../../types/dungeons.ts";
import type { DungeonTableProps } from "./types";
import "./styles.css";

export type DungeonSortKey = "default" | "name" | "size" | "itemLevel";

function getItemLevelTier(itemLevel: number[]): number {
  if (itemLevel.length === 0) return 1;
  const max = Math.max(...itemLevel);
  if (max >= 260) return 4;
  if (max >= 240) return 3;
  if (max >= 220) return 2;
  return 1;
}

function getMaxItemLevel(d: DungeonRecord): number {
  return d.itemLevel.length > 0 ? Math.max(...d.itemLevel) : 0;
}

function sortDungeons(
  list: DungeonRecord[],
  key: DungeonSortKey,
  dir: "asc" | "desc"
): DungeonRecord[] {
  if (key === "default") return [...list];
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
  onResetCharacter,
  onDeleteCharacter,
}: DungeonTableProps) {
  const [sortKey, setSortKey] = useState<DungeonSortKey>("default");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const sortedDungeons = useMemo(
    () => sortDungeons(dungeons, sortKey, sortDir),
    [dungeons, sortKey, sortDir]
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
          <th scope="col" className="dungeon-table-delete-col" aria-label="Delete dungeon" />
          <th scope="col" className="dungeon-table-sticky-col">
            <div className="dungeon-table-dungeon-header">
              <span className="dungeon-table-dungeon-header-label">Dungeon</span>
              <div className="dungeon-table-sort">
                <select
                  id="dungeon-sort"
                  className="dungeon-table-sort-select"
                  value={sortKey}
                  onChange={handleSortChange}
                  aria-label="Sort dungeons by"
                >
                  <option value="default">Default</option>
                  <option value="name">Name</option>
                  <option value="size">Size</option>
                  <option value="itemLevel">Item level</option>
                </select>
                {sortKey !== "default" && (
                  <button
                    type="button"
                    className="dungeon-table-sort-dir-btn"
                    onClick={cycleSortDir}
                    aria-label={`Sort ${sortDir === "asc" ? "ascending" : "descending"}`}
                    title={sortDir === "asc" ? "Ascending (click for descending)" : "Descending (click for ascending)"}
                  >
                    {sortDir === "asc" ? "↑" : "↓"}
                  </button>
                )}
              </div>
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
              colSpan={2 + characters.length}
              className="dungeon-table-empty-state"
            >
              Add a dungeon to track
            </td>
          </tr>
        ) : (
          sortedDungeons.map((dungeon) => (
          <tr key={dungeon.id}>
            <td className="dungeon-table-delete-col">
              <button
                type="button"
                className="delete-dungeon-btn"
                onClick={() => onDeleteDungeon(dungeon.id)}
                aria-label={`Delete ${dungeon.name}`}
              >
                🗑️
              </button>
            </td>
            <td className="dungeon-table-sticky-col">
              <div
                className="dungeon-table-dungeon-cell"
                title={
                  dungeon.itemLevel.length > 0
                    ? `${dungeon.name} — Item level: ${dungeon.itemLevel.join(", ")}`
                    : `${dungeon.name} — Item level not set`
                }
              >
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
