import { useState } from "react";
import { CharacterForm } from "./components/CharacterForm.tsx";
import { CharacterList } from "./components/CharacterList.tsx";
import { DungeonList } from "./data/dungeons.ts";
import { Classes, type CharacterRecord, type CharacterClass } from "./types/characters.ts";
import { DungeonMode } from "./types/dungeons.ts";
import "./App.css";

function App() {
  const [characterName, setCharacterName] = useState("");
  const [characterClass, setCharacterClass] = useState<CharacterClass | "">("");
  const [characters, setCharacters] = useState<CharacterRecord[]>([]);

  const handleAddCharacter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!characterName.trim()) return;
    const newCharacter: CharacterRecord = {
      id: crypto.randomUUID(),
      name: characterName.trim(),
      class: characterClass || undefined,
    };
    setCharacters((prev) => [...prev, newCharacter]);
    setCharacterName("");
    setCharacterClass("");
  };

  const handleDeleteCharacter = (id: string) => {
    setCharacters((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <>
      <header>
        <h1>My Raid CDs</h1>
      </header>
      <CharacterForm
        characterName={characterName}
        setCharacterName={setCharacterName}
        characterClass={characterClass}
        setCharacterClass={setCharacterClass}
        onSubmit={handleAddCharacter}
      />
      <CharacterList characters={characters} onDelete={handleDeleteCharacter} />
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
