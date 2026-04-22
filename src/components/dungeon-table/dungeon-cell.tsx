import type { MouseEvent } from "react";
import { DungeonMode } from "../../types/dungeons";
import type { DungeonRecord } from "../../types/dungeons";
import { dungeonCellTitle, getItemLevelTier } from "./dungeon-table-utils";

type Props = {
  dungeon: DungeonRecord;
  completionCount: number;
  onDeleteDungeonClick: (event: MouseEvent<HTMLButtonElement>) => void;
};

export function DungeonCell({
  dungeon,
  completionCount,
  onDeleteDungeonClick,
}: Props) {
  return (
    <div
      className="dungeon-table-dungeon-cell"
      title={dungeonCellTitle(dungeon, completionCount)}
    >
      <div className="dungeon-table-dungeon-cell-text">
        <span
          className={`dungeon-mode dungeon-mode--${
            dungeon.mode === DungeonMode.HEROIC ? "heroic" : "normal"
          }`}
        >
          {dungeon.size}
        </span>
        <span
          className="dungeon-table-dungeon-count"
          data-empty={completionCount === 0}
          aria-label={`${dungeon.name}: ${completionCount} completions`}
          title={`${completionCount} completions`}
        >
          {completionCount}
        </span>
        <span
          className={`dungeon-name dungeon-name--tier-${getItemLevelTier(
            dungeon.itemLevel
          )}`}
        >
          {dungeon.name}
        </span>
      </div>
      <button
        type="button"
        className="delete-dungeon-btn"
        data-dungeon-id={dungeon.id}
        onClick={onDeleteDungeonClick}
        aria-label={`Delete ${dungeon.name}`}
      >
        🗑️
      </button>
    </div>
  );
}
