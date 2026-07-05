import { Box, Stack, TextField } from "@mui/material";
import { useMemo, useState } from "react";
import type { CharacterRecord } from "../../types/characters.ts";
import { useTranslation } from "../../i18n/use-translation.ts";
import {
  isCharacterIncludedInExport,
  resolveEffectiveExportSpecSelection,
  resolveExportSpecSelection,
  type CharacterExportSpecSelection,
} from "../../utils/format-character-export.ts";
import { buildExportStatusString } from "../../utils/build-export-status.ts";
import {
  EXPORT_MIN_GS_COMPACT_DEFAULT,
  resolveExportMinGearScoreThreshold,
} from "../../utils/parse-export-min-gear-score.ts";
import { ExportCharacterSpecFilter } from "./export-character-spec-filter.tsx";
import { ExportDungeonFilter } from "./export-dungeon-filter.tsx";
import { ExportFilterBlock } from "./export-filter-block.tsx";
import { ExportFilterSection } from "./export-filter-section.tsx";
import { ExportMinGearScoreFilter } from "./export-min-gear-score-filter.tsx";
import { ExportRoleFilterPanel } from "./export-role-filter.tsx";
import {
  getExportFilterGridTemplateAreas,
  getExportFilterGridTemplateColumns,
  getExportFilterGridTemplateRows,
} from "./constants.ts";
import type { ExportPanelProps } from "./types.ts";
import {
  DEFAULT_EXPORT_ROLE_FILTER,
  type ExportRoleFilter,
} from "../../utils/export-spec-role.ts";

type StoredExportSpecSelection = Partial<CharacterExportSpecSelection>;

export function ExportPanel({
  characters,
  visibleDungeons,
  dungeonToggles,
  dungeonNameSearch,
  totalDungeonCount,
}: ExportPanelProps) {
  const { t, locale } = useTranslation();
  const [exportSpecSelectionByCharacterId, setExportSpecSelectionByCharacterId] =
    useState<Record<string, StoredExportSpecSelection>>({});
  const [minGearScoreFilterEnabled, setMinGearScoreFilterEnabled] = useState(false);
  const [minGearScoreCompact, setMinGearScoreCompact] = useState(
    EXPORT_MIN_GS_COMPACT_DEFAULT,
  );
  const [roleFilter, setRoleFilter] = useState<ExportRoleFilter>(
    () => ({ ...DEFAULT_EXPORT_ROLE_FILTER }),
  );

  const hasDungeonFilter = totalDungeonCount > 0;

  const minGearScore = useMemo(
    () => resolveExportMinGearScoreThreshold(minGearScoreFilterEnabled, minGearScoreCompact),
    [minGearScoreCompact, minGearScoreFilterEnabled],
  );

  const includedCharacters = useMemo(
    () =>
      characters.filter((character) =>
        isCharacterIncludedInExport(
          character,
          resolveEffectiveExportSpecSelection(
            character,
            exportSpecSelectionByCharacterId,
            roleFilter,
            minGearScore,
          ),
        ),
      ),
    [characters, exportSpecSelectionByCharacterId, minGearScore, roleFilter],
  );

  const statusText = useMemo(
    () =>
      buildExportStatusString({
        characters: includedCharacters,
        dungeons: visibleDungeons,
        dungeonToggles,
        exportSpecSelectionByCharacterId,
        minGearScore,
        roleFilter,
        locale,
        t,
      }),
    [
      dungeonToggles,
      exportSpecSelectionByCharacterId,
      includedCharacters,
      locale,
      minGearScore,
      roleFilter,
      t,
      visibleDungeons,
    ],
  );

  const setSpecIncluded = (
    character: CharacterRecord,
    slot: keyof CharacterExportSpecSelection,
    included: boolean,
  ) => {
    setExportSpecSelectionByCharacterId((previous) => {
      const resolved = resolveExportSpecSelection(character, previous);
      return {
        ...previous,
        [character.id]: {
          ...previous[character.id],
          includeMain:
            slot === "includeMain" ? included : resolved.includeMain,
          includeOff: slot === "includeOff" ? included : resolved.includeOff,
          includeWithoutSpec:
            slot === "includeWithoutSpec"
              ? included
              : resolved.includeWithoutSpec,
        },
      };
    });
  };

  return (
    <Stack spacing={1.5}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            md: getExportFilterGridTemplateColumns(),
          },
          gridTemplateRows: {
            xs: "auto",
            md: getExportFilterGridTemplateRows(),
          },
          gridTemplateAreas: {
            xs: "none",
            md: getExportFilterGridTemplateAreas(hasDungeonFilter),
          },
          gap: 1.5,
          alignItems: "stretch",
          width: "fit-content",
          maxWidth: "100%",
        }}
      >
        {hasDungeonFilter ? (
          <ExportFilterBlock gridArea="dungeon">
            <ExportFilterSection
              title={t("exportPanel.dungeonFilterTitle")}
              description={t("exportPanel.dungeonFilterHelper")}
            >
              <ExportDungeonFilter
                dungeonNameSearch={dungeonNameSearch}
                visibleDungeons={visibleDungeons}
                totalDungeonCount={totalDungeonCount}
                locale={locale}
                t={t}
              />
            </ExportFilterSection>
          </ExportFilterBlock>
        ) : null}

        <ExportFilterBlock gridArea="gearScore">
          <ExportFilterSection
            title={t("exportPanel.gearScoreFilterTitle")}
            description={t("exportPanel.minGearScoreHelper")}
            contentSx={{ overflow: "visible" }}
          >
            <ExportMinGearScoreFilter
              enabled={minGearScoreFilterEnabled}
              compactValue={minGearScoreCompact}
              onEnabledChange={setMinGearScoreFilterEnabled}
              onCompactValueChange={setMinGearScoreCompact}
            />
          </ExportFilterSection>
        </ExportFilterBlock>

        <ExportFilterBlock gridArea="role">
          <ExportFilterSection
            title={t("exportPanel.roleFilterTitle")}
            description={t("exportPanel.roleFilterHelper")}
          >
            <ExportRoleFilterPanel
              roleFilter={roleFilter}
              onRoleFilterChange={setRoleFilter}
            />
          </ExportFilterSection>
        </ExportFilterBlock>

        <ExportFilterBlock gridArea="characterSpecs">
          <ExportFilterSection
            title={t("exportPanel.characterSpecsFilterTitle")}
            description={t("exportPanel.characterSpecsFilterHelper")}
          >
            <ExportCharacterSpecFilter
              characters={characters}
              exportSpecSelectionByCharacterId={exportSpecSelectionByCharacterId}
              roleFilter={roleFilter}
              minGearScore={minGearScore}
              onSpecIncluded={setSpecIncluded}
            />
          </ExportFilterSection>
        </ExportFilterBlock>
      </Box>

      <TextField
        label={t("exportPanel.exportText")}
        value={statusText}
        multiline
        minRows={4}
        maxRows={16}
        slotProps={{
          input: {
            readOnly: true,
          },
          htmlInput: {
            "aria-label": t("exportPanel.textareaAria"),
          },
        }}
        onFocus={(event) => {
          event.target.select();
        }}
      />
    </Stack>
  );
}
