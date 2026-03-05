import { Classes, type CharacterClass } from "../types/characters.ts";

type CharacterFormProps = {
  characterName: string;
  setCharacterName: (value: string) => void;
  characterClass: CharacterClass | "";
  setCharacterClass: (value: CharacterClass | "") => void;
  onSubmit: (e: React.FormEvent) => void;
};

export function CharacterForm({
  characterName,
  setCharacterName,
  characterClass,
  setCharacterClass,
  onSubmit,
}: CharacterFormProps) {
  return (
    <form className="character-form" onSubmit={onSubmit}>
      <label>
        Name
        <input
            type="text"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            placeholder="Character name"
            required
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
          required
        >
          <option value="">Select class</option>
          {Classes.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" className="add-character-btn">
        Add character
      </button>
    </form>
  );
}
