import { DungeonList } from "./data/dungeons.ts";
import { Classes } from "./types/characters.ts";
import { DungeonMode } from "./types/dungeons.ts";
import "./App.css";

function App() {
  return (
    <>
      <header>
        <h1>My Raid CDs</h1>
      </header>
      <ul className="class-list">
        {Classes.map((c) => (
          <li
            key={c.name}
            className="class-item"
            style={{ color: c.color ? `#${c.color}` : undefined }}
          >
            <img src={c.icon} alt="" className="class-icon" />
            <span>{c.name}</span>
          </li>
        ))}
      </ul>
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
