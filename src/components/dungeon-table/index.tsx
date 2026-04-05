import { useState, useMemo } from "react";
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
                    onChange={(e) =>
                      setSortKey(e.target.value as DungeonSortKey)
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
                    onClick={() =>
                      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
                    }
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
            const hasToggles = characterHasToggles(
              dungeonToggles[char.id]
            );
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
