import { Box, FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material";
import { getLocalizedSpecName } from "../../i18n/localized-domain.ts";
import type { TranslateFn } from "../../i18n/translate.ts";
import { useTranslation } from "../../i18n/use-translation.ts";
import type { CharacterRecord, CharacterSpecGear } from "../../types/characters.ts";
import type { GearPickSpecSide } from "../../utils/build-gear-pick-items.ts";
import {
  CharacterSpecListName,
  InactiveSpecTooltip,
  SpecCell,
} from "../character-spec-list/index.ts";
import {
  CHARACTER_SPEC_LIST_ICON_SIZE,
  getCharacterSpecListGridSx,
  getExportFilterSpecsListMaxHeight,
} from "../export-panel/constants.ts";
import { CharacterSpecGearLabel } from "../spec-option-label/index.tsx";

export type GearPickCharacterSelection = {
  characterId: string;
  side: GearPickSpecSide;
};

type GearPickCharacterSelectProps = {
  characters: readonly CharacterRecord[];
  includedCharacterIds: ReadonlySet<string>;
  selection: GearPickCharacterSelection | null;
  onSelectionChange: (selection: GearPickCharacterSelection) => void;
  t: TranslateFn;
};

function selectionValue(selection: GearPickCharacterSelection): string {
  return `${selection.characterId}:${selection.side}`;
}

function parseSelectionValue(value: string): GearPickCharacterSelection | null {
  const [characterId, side] = value.split(":");
  if (!characterId || (side !== "main" && side !== "off")) {
    return null;
  }
  return { characterId, side };
}

function GearPickSpecRadio({
  character,
  specGear,
  side,
  cooldownInactive,
  t,
}: {
  character: CharacterRecord;
  specGear: CharacterSpecGear;
  side: GearPickSpecSide;
  cooldownInactive: boolean;
  t: TranslateFn;
}) {
  const { locale } = useTranslation();

  if (!character.class) {
    return null;
  }

  const control = (
    <FormControlLabel
      value={selectionValue({ characterId: character.id, side })}
      control={<Radio size="small" disabled={cooldownInactive} />}
      aria-label={t("gearPickPanel.selectSpecAria", {
        name: character.name,
        spec: getLocalizedSpecName(character.class.name, specGear.spec, locale),
      })}
      label={
        <CharacterSpecGearLabel
          characterClass={character.class}
          spec={specGear.spec}
          gearScore={specGear.gearScore}
          iconSize={CHARACTER_SPEC_LIST_ICON_SIZE}
          variant="caption"
          showSpecName={false}
          showDetailTooltip={false}
          color={cooldownInactive ? "text.secondary" : "inherit"}
        />
      }
      sx={{
        m: 0,
        gap: 0.25,
        minWidth: 0,
        "& .MuiRadio-root": {
          p: 0.25,
          ...(cooldownInactive ? { opacity: 0.45 } : null),
        },
        "& .MuiFormControlLabel-label": { ml: 0, minWidth: 0 },
        ...(cooldownInactive
          ? { "& img": { opacity: 0.45, filter: "grayscale(1)" } }
          : null),
      }}
    />
  );

  return (
    <InactiveSpecTooltip
      title={
        cooldownInactive ? t("exportPanel.characterInactiveCooldownHint") : null
      }
    >
      {control}
    </InactiveSpecTooltip>
  );
}

export function GearPickCharacterSelect({
  characters,
  includedCharacterIds,
  selection,
  onSelectionChange,
  t,
}: GearPickCharacterSelectProps) {
  const listMaxHeight = getExportFilterSpecsListMaxHeight();

  if (characters.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        {t("common.none")}
      </Typography>
    );
  }

  return (
    <RadioGroup
      value={selection ? selectionValue(selection) : ""}
      onChange={(event) => {
        const next = parseSelectionValue(event.target.value);
        if (next && includedCharacterIds.has(next.characterId)) {
          onSelectionChange(next);
        }
      }}
      sx={getCharacterSpecListGridSx({ maxHeight: listMaxHeight })}
    >
      {characters.map((character) => {
        if (!character.class) {
          return null;
        }

        const hasMain = Boolean(character.mainSpec);
        const hasOff = Boolean(character.offSpec);
        const hasNoSpecs = !hasMain && !hasOff;
        const cooldownInactive = !includedCharacterIds.has(character.id);

        return (
          <Box key={character.id} sx={{ display: "contents" }}>
            <InactiveSpecTooltip
              title={
                cooldownInactive
                  ? t("exportPanel.characterInactiveCooldownHint")
                  : null
              }
            >
              <CharacterSpecListName
                name={character.name}
                inactive={cooldownInactive}
              />
            </InactiveSpecTooltip>
            <SpecCell>
              {hasMain && character.mainSpec ? (
                <GearPickSpecRadio
                  character={character}
                  specGear={character.mainSpec}
                  side="main"
                  cooldownInactive={cooldownInactive}
                  t={t}
                />
              ) : hasNoSpecs ? (
                <Typography variant="caption" color="text.secondary">
                  {t("common.none")}
                </Typography>
              ) : null}
            </SpecCell>
            <SpecCell>
              {hasOff && character.offSpec ? (
                <GearPickSpecRadio
                  character={character}
                  specGear={character.offSpec}
                  side="off"
                  cooldownInactive={cooldownInactive}
                  t={t}
                />
              ) : null}
            </SpecCell>
          </Box>
        );
      })}
    </RadioGroup>
  );
}
