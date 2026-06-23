import type { CharacterRecord } from "../types/characters.ts";
import type { DungeonRecord, DungeonToggles } from "../types/dungeons.ts";
import { formatCharacterImportLabel } from "./format-character-import.ts";
import { formatDungeonImportLabel } from "./format-dungeon-label.ts";
import { isCooldownOn } from "./dungeon-toggles.ts";

export type BuildImportStatusParams = {
  characters: CharacterRecord[];
  dungeons: DungeonRecord[];
  dungeonToggles: DungeonToggles;
};

/** Characters without CD (toggle off) per visible dungeon, one line each. */
export function buildImportStatusString({
  characters,
  dungeons,
  dungeonToggles,
}: BuildImportStatusParams): string {
  if (dungeons.length === 0) {
    return "No dungeons match the current filter.";
  }
  if (characters.length === 0) {
    return "Select at least one character.";
  }

  const lines: string[] = [];

  for (const dungeon of dungeons) {
    const charactersWithoutCd = characters.filter(
      (character) =>
        !isCooldownOn(dungeonToggles, character.id, dungeon.id),
    );
    if (charactersWithoutCd.length === 0) {
      continue;
    }
    const label = formatDungeonImportLabel(dungeon);
    const names = charactersWithoutCd
      .map((character) => formatCharacterImportLabel(character))
      .join(", ");
    lines.push(`${label} - ${names}`);
  }

  if (lines.length === 0) {
    return "All selected characters have CD on matching dungeons.";
  }

  return lines.join("\n");
}
