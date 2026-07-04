import { Checkbox, FormControlLabel, Stack, Typography } from "@mui/material";
import { getLocalizedSpecName } from "../../i18n/localized-domain.ts";
import type { TranslateFn } from "../../i18n/translate.ts";
import { useTranslation } from "../../i18n/use-translation.ts";
import type { CharacterRecord, CharacterSpecGear } from "../../types/characters.ts";
import type { ExportRoleFilter } from "../../utils/export-spec-role.ts";
import {
  characterHasExportSpecs,
  isSpecIncludedForExportRole,
  resolveEffectiveExportSpecSelection,
  specPassesExportMinGearScore,
  type CharacterExportSpecSelection,
  type ExportSpecSelectionByCharacterId,
} from "../../utils/format-character-export.ts";
import { CharacterSpecGearLabel } from "../spec-option-label/index.tsx";

type ExportCharacterSpecFilterProps = {
  characters: CharacterRecord[];
  exportSpecSelectionByCharacterId: ExportSpecSelectionByCharacterId;
  roleFilter: ExportRoleFilter;
  minGearScore: number | undefined;
  onSpecIncluded: (
    character: CharacterRecord,
    slot: keyof CharacterExportSpecSelection,
    included: boolean,
  ) => void;
};

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
  t: TranslateFn;
};

function ExportSpecCheckbox({
  character,
  specGear,
  slot,
  checked,
  disabled = false,
  onCheckedChange,
  t,
}: ExportSpecCheckboxProps) {
  const { locale } = useTranslation();

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

export function ExportCharacterSpecFilter({
  characters,
  exportSpecSelectionByCharacterId,
  roleFilter,
  minGearScore,
  onSpecIncluded,
}: ExportCharacterSpecFilterProps) {
  const { t } = useTranslation();

  if (characters.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        {t("exportPanel.noCharacters")}
      </Typography>
    );
  }

  return (
    <Stack spacing={1}>
      {characters.map((character) => {
        const selection = resolveEffectiveExportSpecSelection(
          character,
          exportSpecSelectionByCharacterId,
          roleFilter,
          minGearScore,
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
        const mainGearScoreAllowed =
          !character.mainSpec ||
          specPassesExportMinGearScore(character.mainSpec, minGearScore);
        const offGearScoreAllowed =
          !character.offSpec ||
          specPassesExportMinGearScore(character.offSpec, minGearScore);

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
                disabled={!mainRoleAllowed || !mainGearScoreAllowed}
                onCheckedChange={(slot, included) => {
                  onSpecIncluded(character, slot, included);
                }}
                t={t}
              />
            ) : null}
            {character.offSpec ? (
              <ExportSpecCheckbox
                character={character}
                specGear={character.offSpec}
                slot="includeOff"
                checked={selection.includeOff}
                disabled={!offRoleAllowed || !offGearScoreAllowed}
                onCheckedChange={(slot, included) => {
                  onSpecIncluded(character, slot, included);
                }}
                t={t}
              />
            ) : null}
            {!hasSpecs ? (
              <Checkbox
                size="small"
                checked={selection.includeWithoutSpec}
                onChange={(event) => {
                  onSpecIncluded(
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
  );
}
