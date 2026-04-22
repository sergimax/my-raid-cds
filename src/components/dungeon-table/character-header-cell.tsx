import type { MouseEvent } from "react";
import type { CharacterRecord } from "../../types/characters";

type Props = {
  character: CharacterRecord;
  hasToggles: boolean;
  markedCount: number;
  onResetCharacterClick: (event: MouseEvent<HTMLButtonElement>) => void;
  onDeleteCharacterClick: (event: MouseEvent<HTMLButtonElement>) => void;
};

export function CharacterHeaderCell({
  character,
  hasToggles,
  markedCount,
  onResetCharacterClick,
  onDeleteCharacterClick,
}: Props) {
  return (
    <div className="dungeon-table-character-header">
      <div className="dungeon-table-character-header-name">
        {character.class && (
          <img src={character.class.icon} alt="" className="class-icon" />
        )}
        <span
          className="dungeon-table-character-name"
          style={{
            color: character.class?.color ? `#${character.class.color}` : undefined,
          }}
        >
          {character.name}
        </span>
        <span
          className="dungeon-table-character-count"
          data-empty={markedCount === 0}
          aria-label={`${character.name}: ${markedCount} marked dungeons`}
          title={`${markedCount} marked`}
        >
          {markedCount}
        </span>
      </div>
      <div className="dungeon-table-character-header-actions">
        <button
          type="button"
          className={`reset-character-btn ${!hasToggles ? "reset-btn--inactive" : ""}`}
          data-character-id={character.id}
          onClick={onResetCharacterClick}
          disabled={!hasToggles}
          aria-label={`Reset ${character.name}`}
        >
          🔄
        </button>
        <button
          type="button"
          className="delete-character-btn"
          data-character-id={character.id}
          onClick={onDeleteCharacterClick}
          aria-label={`Delete ${character.name}`}
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
