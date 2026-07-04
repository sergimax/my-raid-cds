import {
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import type { CharacterRecord, CharacterSpecGear } from "../../types/characters.ts";
import { useTranslation } from "../../i18n/use-translation.ts";
import { getLocalizedSpecName } from "../../i18n/localized-domain.ts";
import {
  characterHasExportSpecs,
  isCharacterIncludedInExport,
  isSpecIncludedForExportRole,
  resolveEffectiveExportSpecSelection,
  resolveExportSpecSelection,
  type CharacterExportSpecSelection,
} from "../../utils/format-character-export.ts";
import { buildExportStatusString } from "../../utils/build-export-status.ts";
import {
  EXPORT_MIN_GS_COMPACT_DEFAULT,
  resolveExportMinGearScoreThreshold,
} from "../../utils/parse-export-min-gear-score.ts";
import { CharacterSpecGearLabel } from "../spec-option-label/index.tsx";
import { ExportMinGearScoreFilter } from "./export-min-gear-score-filter.tsx";
import { ExportRoleFilterPanel } from "./export-role-filter.tsx";
import type { ExportPanelProps } from "./types.ts";
import {
  DEFAULT_EXPORT_ROLE_FILTER,
  type ExportRoleFilter,
} from "../../utils/export-spec-role.ts";

type StoredExportSpecSelection = Partial<CharacterExportSpecSelection>;

type ExportSpecCheckboxProps = {
  character: CharacterRecord;
  specGear: CharacterSpecGear;
  slot: keyof CharacterExportSpecSelection;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange: (
    slot: keyof CharacterExportSpecSelection,
    included: boolean,
  ) => void;
};

function ExportSpecCheckbox({
  character,
  specGear,
  slot,
  checked,
  disabled = false,
  onCheckedChange,
}: ExportSpecCheckboxProps) {
  const { t, locale } = useTranslation();

  if (!character.class) {
    return null;
  }

  const specLabel = getLocalizedSpecName(
    character.class.name,
    specGear.spec,
    locale,
  );

  return (
    <FormControlLabel
      control={
        <Checkbox
          size="small"
          checked={checked}
          disabled={disabled}
          onChange={(event) => {
            onCheckedChange(slot, event.target.checked);
          }}
          slotProps={{
            input: {
              "aria-label": t("exportPanel.includeSpecAria", {
                spec: specLabel,
                name: character.name,
              }),
            },
          }}
        />
      }
      label={
        <CharacterSpecGearLabel
          characterClass={character.class}
          spec={specGear.spec}
          gearScore={specGear.gearScore}
          iconSize={18}
          showSpecName={false}
        />
      }
      sx={{ mr: 0 }}
    />
  );
}

export function ExportPanel({
  characters,
  visibleDungeons,
  dungeonToggles,
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
          ),
        ),
      ),
    [characters, exportSpecSelectionByCharacterId, roleFilter],
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
    <Stack spacing={2}>
      {characters.length > 0 ? (
        <>
          <ExportMinGearScoreFilter
            enabled={minGearScoreFilterEnabled}
            compactValue={minGearScoreCompact}
            onEnabledChange={setMinGearScoreFilterEnabled}
            onCompactValueChange={setMinGearScoreCompact}
          />
          <ExportRoleFilterPanel
            roleFilter={roleFilter}
            onRoleFilterChange={setRoleFilter}
          />
          <Stack spacing={1}>
            {characters.map((character) => {
              const selection = resolveEffectiveExportSpecSelection(
                character,
                exportSpecSelectionByCharacterId,
                roleFilter,
              );
              const hasSpecs = characterHasExportSpecs(character);
              const mainRoleAllowed =
                !character.mainSpec ||
                isSpecIncludedForExportRole(
                  character,
                  character.mainSpec.spec,
                  roleFilter,
                );
              const offRoleAllowed =
                !character.offSpec ||
                isSpecIncludedForExportRole(
                  character,
                  character.offSpec.spec,
                  roleFilter,
                );
              return (
                <Stack
                  key={character.id}
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: "center", flexWrap: "wrap", gap: 1 }}
                >
                  <Typography
                    variant="body2"
                    sx={{ minWidth: 72, fontWeight: 600 }}
                  >
                    {character.name}
                  </Typography>
                  {character.mainSpec ? (
                    <ExportSpecCheckbox
                      character={character}
                      specGear={character.mainSpec}
                      slot="includeMain"
                      checked={selection.includeMain}
                      disabled={!mainRoleAllowed}
                      onCheckedChange={(slot, included) => {
                        setSpecIncluded(character, slot, included);
                      }}
                    />
                  ) : null}
                  {character.offSpec ? (
                    <ExportSpecCheckbox
                      character={character}
                      specGear={character.offSpec}
                      slot="includeOff"
                      checked={selection.includeOff}
                      disabled={!offRoleAllowed}
                      onCheckedChange={(slot, included) => {
                        setSpecIncluded(character, slot, included);
                      }}
                    />
                  ) : null}
                  {!hasSpecs ? (
                    <Checkbox
                      size="small"
                      checked={selection.includeWithoutSpec}
                      onChange={(event) => {
                        setSpecIncluded(
                          character,
                          "includeWithoutSpec",
                          event.target.checked,
                        );
                      }}
                      slotProps={{
                        input: {
                          "aria-label": t("exportPanel.includeCharacterAria", {
                            name: character.name,
                          }),
                        },
                      }}
                    />
                  ) : null}
                </Stack>
              );
            })}
          </Stack>
        </>
      ) : (
        <Typography variant="body2" color="text.secondary">
          {t("exportPanel.noCharacters")}
        </Typography>
      )}
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
