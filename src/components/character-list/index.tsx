import type { CharacterListProps } from "./types.ts";
import "./styles.css";

export function CharacterList({ characters, onDelete }: CharacterListProps) {
  if (characters.length === 0) return null;

  return (
    <ul className="character-list">
      {characters.map((char) => (
        <li key={char.id} className="character-record">
          {char.class && (
            <img src={char.class.icon} alt="" className="class-icon" />
          )}
          <span
            className="character-record-name"
            style={{ color: char.class?.color ? `#${char.class.color}` : undefined }}
          >
            {char.name}
          </span>
          {char.class && (
            <span className="character-record-class">{char.class.name}</span>
          )}
          <button
            type="button"
            className="delete-character-btn"
            onClick={() => onDelete(char.id)}
            aria-label={`Delete ${char.name}`}
          >
            🗑️
          </button>
        </li>
      ))}
    </ul>
  );
}
