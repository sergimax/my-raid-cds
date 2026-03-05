import { DungeonList } from "./data/dungeons.ts";
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
            <th>Name</th>
            <th>Size</th>
            <th>Item Level</th>
            <th>Mode</th>
          </tr>
        </thead>
        <tbody>
          {DungeonList.map((dungeon, i) => (
            <tr key={i}>
              <td>{dungeon.name}</td>
              <td>{dungeon.size}</td>
              <td>{dungeon.itemLevel.join("...")}</td>
              <td>{dungeon.mode}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default App
