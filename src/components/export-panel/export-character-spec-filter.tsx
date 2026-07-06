import type { ReactNode } from "react";
import { Box, Checkbox, FormControlLabel, Tooltip, Typography } from "@mui/material";
import { getLocalizedSpecName } from "../../i18n/localized-domain.ts";
import type { TranslateFn } from "../../i18n/translate.ts";
import { useTranslation } from "../../i18n/use-translation.ts";
import type { CharacterRecord, CharacterSpecGear } from "../../types/characters.ts";
import type { ExportRoleFilter } from "../../utils/export-spec-role.ts";
import {
  characterHasExportSpecs,
  getCharacterExportInactiveReason,
  isSpecIncludedForExportRole,
  resolveEffectiveExportSpecSelection,
  specPassesExportMinGearScore,
  type CharacterExportInactiveReason,
  type CharacterExportSpecSelection,
  type ExportSpecSelectionByCharacterId,
} from "../../utils/format-character-export.ts";
import { CharacterSpecGearLabel } from "../spec-option-label/index.tsx";

type ExportCharacterSpecFilterProps = {
  characters: CharacterRecord[];
  includedCharacterIds: ReadonlySet<string>;
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
  cooldownInactive?: boolean;
  roleAllowed: boolean;
  gearScoreAllowed: boolean;
  onCheckedChange: (
    slot: keyof CharacterExportSpecSelection,
    included: boolean,
  ) => void;
  t: TranslateFn;
};

type SpecFilterTooltipKey =
  | "exportPanel.specInactiveRoleFilter"
  | "exportPanel.specInactiveGearScoreFilter"
  | "exportPanel.specInactiveRoleAndGearScoreFilter";

function characterInactiveTooltipKey(
  inactiveReason: CharacterExportInactiveReason,
): "exportPanel.characterInactiveCooldownHint" | "exportPanel.characterInactiveFiltersHint" {
  return inactiveReason === "cooldown"
    ? "exportPanel.characterInactiveCooldownHint"
    : "exportPanel.characterInactiveFiltersHint";
}

function specFilterTooltipKey(
  roleAllowed: boolean,
  gearScoreAllowed: boolean,
): SpecFilterTooltipKey | null {
  if (roleAllowed && gearScoreAllowed) {
    return null;
  }
  if (!roleAllowed && !gearScoreAllowed) {
    return "exportPanel.specInactiveRoleAndGearScoreFilter";
  }
  if (!roleAllowed) {
    return "exportPanel.specInactiveRoleFilter";
  }
  return "exportPanel.specInactiveGearScoreFilter";
}

function FilterTooltip({
  title,
  children,
}: {
  title: string | null;
  children: ReactNode;
}) {
  if (!title) {
    return <>{children}</>;
  }

  return (
    <Tooltip title={title}>
      <Box component="span" sx={{ display: "inline-flex", minWidth: 0, width: "100%" }}>
        {children}
      </Box>
    </Tooltip>
  );
}

function ExportSpecCheckbox({
  character,
  specGear,
  slot,
  checked,
  disabled = false,
  cooldownInactive = false,
  roleAllowed,
  gearScoreAllowed,
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
  const specFilteredOut = !cooldownInactive && (!roleAllowed || !gearScoreAllowed);
  const filterTooltipKey = specFilterTooltipKey(roleAllowed, gearScoreAllowed);
  const tooltipTitle = cooldownInactive
    ? t("exportPanel.characterInactiveCooldownHint")
    : filterTooltipKey
      ? t(filterTooltipKey)
      : null;

  const control = (
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
          color={cooldownInactive || specFilteredOut ? "text.secondary" : "inherit"}
        />
      }
      sx={{
        mr: 0,
        width: "100%",
        ...(cooldownInactive && {
          "& .MuiCheckbox-root": { opacity: 0.45 },
          "& img": { opacity: 0.45, filter: "grayscale(1)" },
        }),
        ...(specFilteredOut && {
          "& .MuiCheckbox-root": { opacity: 0.55 },
          "& .MuiTypography-root": { textDecoration: "line-through" },
        }),
      }}
    />
  );

  return <FilterTooltip title={tooltipTitle}>{control}</FilterTooltip>;
}

function SpecCell({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", minWidth: 0 }}>{children}</Box>
  );
}

export function ExportCharacterSpecFilter({
  characters,
  includedCharacterIds,
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
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "max-content minmax(6rem, 1fr) minmax(6rem, 1fr)",
        columnGap: 1,
        rowGap: 0.75,
        alignItems: "center",
        minWidth: 0,
      }}
    >
      {characters.map((character) => {
        const inactiveReason = getCharacterExportInactiveReason(
          character,
          includedCharacterIds,
          roleFilter,
          minGearScore,
        );
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
        const cooldownInactive = inactiveReason === "cooldown";
        const characterName = (
          <Typography
            variant="body2"
            sx={{
              fontWeight: inactiveReason ? 500 : 600,
              whiteSpace: "nowrap",
              color:
                inactiveReason === "cooldown"
                  ? "text.disabled"
                  : inactiveReason === "filters"
                    ? "text.secondary"
                    : "text.primary",
              fontStyle: inactiveReason === "cooldown" ? "italic" : "normal",
            }}
          >
            {character.name}
          </Typography>
        );

        return (
          <Box key={character.id} sx={{ display: "contents" }}>
            {inactiveReason ? (
              <FilterTooltip title={t(characterInactiveTooltipKey(inactiveReason))}>
                {characterName}
              </FilterTooltip>
            ) : (
              characterName
            )}
            <SpecCell>
              {character.mainSpec ? (
                <ExportSpecCheckbox
                  character={character}
                  specGear={character.mainSpec}
                  slot="includeMain"
                  checked={selection.includeMain}
                  disabled={
                    cooldownInactive ||
                    !mainRoleAllowed ||
                    !mainGearScoreAllowed
                  }
                  cooldownInactive={cooldownInactive}
                  roleAllowed={mainRoleAllowed}
                  gearScoreAllowed={mainGearScoreAllowed}
                  onCheckedChange={(slot, included) => {
                    onSpecIncluded(character, slot, included);
                  }}
                  t={t}
                />
              ) : !hasSpecs ? (
                <FilterTooltip
                  title={
                    cooldownInactive
                      ? t("exportPanel.characterInactiveCooldownHint")
                      : null
                  }
                >
                  <Checkbox
                    size="small"
                    checked={selection.includeWithoutSpec}
                    disabled={cooldownInactive}
                    sx={cooldownInactive ? { opacity: 0.45 } : undefined}
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
                </FilterTooltip>
              ) : null}
            </SpecCell>
            <SpecCell>
              {character.offSpec ? (
                <ExportSpecCheckbox
                  character={character}
                  specGear={character.offSpec}
                  slot="includeOff"
                  checked={selection.includeOff}
                  disabled={
                    cooldownInactive ||
                    !offRoleAllowed ||
                    !offGearScoreAllowed
                  }
                  cooldownInactive={cooldownInactive}
                  roleAllowed={offRoleAllowed}
                  gearScoreAllowed={offGearScoreAllowed}
                  onCheckedChange={(slot, included) => {
                    onSpecIncluded(character, slot, included);
                  }}
                  t={t}
                />
              ) : null}
            </SpecCell>
          </Box>
        );
      })}
    </Box>
  );
}
