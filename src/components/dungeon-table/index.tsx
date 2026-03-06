import { DungeonMode } from "../../types/dungeons.ts";
import type { DungeonTableProps } from "./types";
import "./styles.css";

function getItemLevelTier(itemLevel: number[]): number {
  if (itemLevel.length === 0) return 1;
  const max = Math.max(...itemLevel);
  if (max >= 260) return 4;
  if (max >= 240) return 3;
  if (max >= 220) return 2;
  return 1;
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
  return (
    <table className="dungeon-table">
      <thead>
        <tr>
          <th>Dungeon</th>
          {characters.map((char) => {
            const hasToggles = Object.values(
              dungeonToggles[char.id] ?? {}
            ).some(Boolean);
            return (
              <th key={char.id}>
                <div className="dungeon-table-character-header">
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
                  {hasToggles && (
                    <button
                      type="button"
                      className="reset-character-btn"
                      onClick={() => onResetCharacter(char.id)}
                      aria-label={`Reset ${char.name}`}
                    >
                      Reset
                    </button>
                  )}
                  <button
                    type="button"
                    className="delete-character-btn"
                    onClick={() => onDeleteCharacter(char.id)}
                    aria-label={`Delete ${char.name}`}
                  >
                    Delete
                  </button>
                </div>
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {dungeons.map((dungeon) => (
          <tr key={dungeon.id}>
            <td>
              <div className="dungeon-table-dungeon-cell">
                <span className="dungeon-name">{dungeon.name}</span>
                <span
                  className={`dungeon-mode dungeon-mode--${
                    dungeon.mode === DungeonMode.HEROIC ? "heroic" : "normal"
                  }`}
                >
                  {dungeon.size}
                  {dungeon.mode === DungeonMode.HEROIC ? " 💀" : ""}
                </span>
                <span
                  className={`dungeon-item-level dungeon-item-level--tier-${getItemLevelTier(dungeon.itemLevel)}`}
                >
                  ⚔️ {dungeon.itemLevel.join("...")}
                </span>
                <button
                  type="button"
                  className="delete-dungeon-btn"
                  onClick={() => onDeleteDungeon(dungeon.id)}
                  aria-label={`Delete ${dungeon.name}`}
                >
                  Delete
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
        ))}
      </tbody>
    </table>
  );
}
