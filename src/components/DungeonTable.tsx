import type { CharacterRecord } from "../types/characters.ts";
import type { Dungeon } from "../types/dungeons.ts";
import { DungeonMode } from "../types/dungeons.ts";

type DungeonToggles = Record<string, Record<number, boolean>>;

type DungeonTableProps = {
  dungeons: Dungeon[];
  characters: CharacterRecord[];
  dungeonToggles: DungeonToggles;
  onDungeonToggle: (characterId: string, dungeonIndex: number) => void;
  onResetCharacter: (characterId: string) => void;
  onDeleteCharacter: (id: string) => void;
};

export function DungeonTable({
  dungeons,
  characters,
  dungeonToggles,
  onDungeonToggle,
  onResetCharacter,
  onDeleteCharacter,
}: DungeonTableProps) {
  return (
    <table>
      <thead>
        <tr>
          <th>Dungeon</th>
          {characters.map((char) => (
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
                <button
                  type="button"
                  className="reset-character-btn"
                  onClick={() => onResetCharacter(char.id)}
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
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dungeons.map((dungeon, i) => (
          <tr key={i}>
            <td>
              <span className="dungeon-name">{dungeon.name}</span>
              <span className="dungeon-mode">
                {dungeon.size}
                {dungeon.mode === DungeonMode.HEROIC ? " 💀" : ""}
              </span>
              <span className="dungeon-item-level">
                {dungeon.itemLevel.join("...")}
              </span>
            </td>
            {characters.map((char) => (
              <td key={char.id} className="dungeon-table-character-cell">
                <label className="dungeon-toggle">
                  <input
                    type="checkbox"
                    checked={dungeonToggles[char.id]?.[i] ?? false}
                    onChange={() => onDungeonToggle(char.id, i)}
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
