import { DungeonMode } from "../../types/dungeons.ts";
import type { DungeonTableProps } from "./types";
import "./styles.css";

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
    <table className="dungeon-table" aria-label="Dungeon cooldown tracker">
      <caption>
        Dungeon cooldowns per character. Toggle to mark cooldowns as used.
      </caption>
      <thead>
        <tr>
          <th scope="col" className="dungeon-table-sticky-col">Dungeon</th>
          {characters.map((char) => {
            const hasToggles = Object.values(
              dungeonToggles[char.id] ?? {}
            ).some(Boolean);
            return (
              <th key={char.id} scope="col">
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
                  <div className="dungeon-table-character-header-actions">
                    {hasToggles && (
                      <button
                        type="button"
                        className="reset-character-btn"
                        onClick={() => onResetCharacter(char.id)}
                        aria-label={`Reset ${char.name}`}
                      >
                        🔄
                      </button>
                    )}
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
        {dungeons.map((dungeon) => (
          <tr key={dungeon.id}>
            <td className="dungeon-table-sticky-col">
              <div
                className="dungeon-table-dungeon-cell"
                title={`Item level: ${dungeon.itemLevel.join("...")}`}
              >
                <span
                  className={`dungeon-mode dungeon-mode--${
                    dungeon.mode === DungeonMode.HEROIC ? "heroic" : "normal"
                  }`}
                >
                  {dungeon.size}
                </span>
                <span className="dungeon-name">{dungeon.name}</span>
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
        ))}
      </tbody>
    </table>
  );
}
