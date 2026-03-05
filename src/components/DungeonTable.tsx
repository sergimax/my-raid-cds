import type { CharacterRecord } from "../types/characters.ts";
import type { Dungeon } from "../types/dungeons.ts";
import { DungeonMode } from "../types/dungeons.ts";

type DungeonTableProps = {
  dungeons: Dungeon[];
  characters: CharacterRecord[];
  onDeleteCharacter: (id: string) => void;
};

export function DungeonTable({
  dungeons,
  characters,
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
                  className="delete-character-btn"
                  onClick={() => onDeleteCharacter(char.id)}
                  aria-label={`Delete ${char.name}`}
                >
                  Delete
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
              <td key={char.id} className="dungeon-table-character-cell" />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
