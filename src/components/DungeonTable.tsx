import type { Dungeon } from "../types/dungeons.ts";
import { DungeonMode } from "../types/dungeons.ts";

type DungeonTableProps = {
  dungeons: Dungeon[];
};

export function DungeonTable({ dungeons }: DungeonTableProps) {
  return (
    <table>
      <thead>
        <tr>
          <th>Dungeon</th>
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
          </tr>
        ))}
      </tbody>
    </table>
  );
}
