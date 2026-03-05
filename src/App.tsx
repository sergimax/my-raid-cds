import { DungeonList } from "./data/dungeons.ts";
import { DungeonMode } from "./types/dungeons.ts";
import "./App.css";

function App() {
  return (
    <>
      <header>
        <h1>My Raid CDs</h1>
      </header>
      <table>
        <thead>
          <tr>
            <th>Dungeon</th>
          </tr>
        </thead>
        <tbody>
          {DungeonList.map((dungeon, i) => (
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
    </>
  );
}

export default App
