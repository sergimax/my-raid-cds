import { DungeonList } from "./data/dungeons.ts";
import { DungeonMode } from "./types/dungeons.ts";
import "./App.css";

function formatName(dungeon: (typeof DungeonList)[number]): string {
  const modeSuffix = dungeon.mode === DungeonMode.HEROIC ? " 💀" : "";
  return `${dungeon.name} ${dungeon.size}${modeSuffix}`;
}

function App() {
  return (
    <>
      <header>
        <h1>My Raid CDs</h1>
      </header>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Item Level</th>
          </tr>
        </thead>
        <tbody>
          {DungeonList.map((dungeon, i) => (
            <tr key={i}>
              <td>{formatName(dungeon)}</td>
              <td>{dungeon.itemLevel.join("...")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default App
