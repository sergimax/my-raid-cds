import { useId } from "react";
import { Classes } from "../../types/characters.ts";
import type { CharacterFormProps } from "./types";
import "./styles.css";

export function CharacterForm({
  characterName,
  setCharacterName,
  characterClass,
  setCharacterClass,
  onSubmit,
  duplicateError,
}: CharacterFormProps) {
  const id = useId();
  const nameId = `${id}-name`;
  const classId = `${id}-class`;

  return (
    <form className="character-form" onSubmit={onSubmit}>
      {duplicateError && (
        <p className="character-form-error" role="alert">
          {duplicateError}
        </p>
      )}
      <label htmlFor={nameId}>
        Name
        <input
          id={nameId}
          type="text"
          value={characterName}
          onChange={(e) => setCharacterName(e.target.value)}
          placeholder="Character name"
          required
        />
      </label>
      <label htmlFor={classId}>
        Class
        <select
          id={classId}
          value={characterClass ? characterClass.name : ""}
          onChange={(e) => {
            const c = Classes.find((cls) => cls.name === e.target.value);
            setCharacterClass(c ?? "");
          }}
          required
        >
          <option value="">Select class</option>
          {Classes.map((c) => (
            <option
              key={c.name}
              value={c.name}
              style={{ color: c.color ? `#${c.color}` : undefined }}
            >
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
