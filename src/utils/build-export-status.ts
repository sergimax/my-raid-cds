import type { CharacterRecord } from "../types/characters.ts";
import type { DungeonRecord, DungeonToggles } from "../types/dungeons.ts";
import type { AppLocale } from "../i18n/types.ts";
import type { TranslateFn } from "../i18n/translate.ts";
import {
  formatCharacterExportLabel,
  resolveEffectiveExportSpecSelection,
  type ExportSpecSelectionByCharacterId,
} from "./format-character-export.ts";
import { formatDungeonExportLabel } from "./format-dungeon-label.ts";
import { isCooldownOn } from "./dungeon-toggles.ts";
import type { ExportRoleFilter } from "./export-spec-role.ts";
import { DEFAULT_EXPORT_ROLE_FILTER } from "./export-spec-role.ts";

export type BuildExportStatusParams = {
  characters: CharacterRecord[];
  dungeons: DungeonRecord[];
  dungeonToggles: DungeonToggles;
  exportSpecSelectionByCharacterId?: ExportSpecSelectionByCharacterId;
  minGearScore?: number;
  roleFilter?: ExportRoleFilter;
  locale?: AppLocale;
  t: TranslateFn;
};

/** Characters without CD (toggle off) per visible dungeon, one line each. */
export function buildExportStatusString({
  characters,
  dungeons,
  dungeonToggles,
  exportSpecSelectionByCharacterId,
  minGearScore,
  roleFilter,
  locale = "en",
  t,
}: BuildExportStatusParams): string {
  const effectiveRoleFilter = roleFilter ?? DEFAULT_EXPORT_ROLE_FILTER;

  if (dungeons.length === 0) {
    return t("exportPanel.noDungeonsFilter");
  }
  if (characters.length === 0) {
    return t("exportPanel.selectCharacter");
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
    const label = formatDungeonExportLabel(dungeon, locale);
    const names = charactersWithoutCd
      .map((character) =>
        formatCharacterExportLabel(
          character,
          resolveEffectiveExportSpecSelection(
            character,
            exportSpecSelectionByCharacterId,
            effectiveRoleFilter,
            minGearScore,
          ),
          locale,
        ),
      )
      .filter((entry): entry is string => entry !== null)
      .join(" / ");
    if (names.length === 0) {
      continue;
    }
    lines.push(`${label} - ${names}`);
  }

  if (lines.length === 0) {
    return t("exportPanel.allHaveCd");
  }

  return lines.join("\n");
}
