import { useState } from "react";
import { DungeonList } from "./data/dungeons.ts";
import { Classes, type CharacterClass } from "./types/characters.ts";
import { DungeonMode } from "./types/dungeons.ts";
import "./App.css";

function App() {
  const [characterName, setCharacterName] = useState("");
  const [characterClass, setCharacterClass] = useState<CharacterClass | "">("");

  return (
    <>
      <header>
        <h1>My Raid CDs</h1>
      </header>
      <form className="character-form">
        <label>
          Name
          <input
            type="text"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            placeholder="Character name"
          />
        </label>
        <label>
          Class
          <select
            value={characterClass === "" ? "" : characterClass.name}
            onChange={(e) => {
              const c = Classes.find((cls) => cls.name === e.target.value);
              setCharacterClass(c ?? "");
            }}
          >
            <option value="">Select class</option>
            {Classes.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      </form>
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
