import { Box, FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { getLocalizedSpecName } from "../../i18n/localized-domain.ts";
import type { TranslateFn } from "../../i18n/translate.ts";
import { useTranslation } from "../../i18n/use-translation.ts";
import type { CharacterRecord, CharacterSpecGear } from "../../types/characters.ts";
import type { GearPickSpecSide } from "../../utils/build-gear-pick-items.ts";
import { CharacterSpecGearLabel } from "../spec-option-label/index.tsx";
import { getExportFilterSpecsListMaxHeight } from "../export-panel/constants.ts";

export type GearPickCharacterSelection = {
  characterId: string;
  side: GearPickSpecSide;
};

type GearPickCharacterSelectProps = {
  characters: readonly CharacterRecord[];
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

function SpecCell({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", minWidth: 0 }}>{children}</Box>
  );
}

function GearPickSpecRadio({
  character,
  specGear,
  side,
  t,
}: {
  character: CharacterRecord;
  specGear: CharacterSpecGear;
  side: GearPickSpecSide;
  t: TranslateFn;
}) {
  const { locale } = useTranslation();

  if (!character.class) {
    return null;
  }

  return (
    <FormControlLabel
      value={selectionValue({ characterId: character.id, side })}
      control={<Radio size="small" />}
      aria-label={t("gearPickPanel.selectSpecAria", {
        name: character.name,
        spec: getLocalizedSpecName(character.class.name, specGear.spec, locale),
      })}
      label={
        <CharacterSpecGearLabel
          characterClass={character.class}
          spec={specGear.spec}
          gearScore={specGear.gearScore}
          iconSize={18}
          showSpecName={false}
          showDetailTooltip={false}
        />
      }
      sx={{ mr: 0, width: "100%" }}
    />
  );
}

export function GearPickCharacterSelect({
  characters,
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
        if (next) {
          onSelectionChange(next);
        }
      }}
      sx={{
        display: "grid",
        gridTemplateColumns: "max-content minmax(6rem, 1fr) minmax(6rem, 1fr)",
        columnGap: 1,
        rowGap: 0.75,
        alignItems: "center",
        minWidth: 0,
        maxHeight: listMaxHeight,
        overflowY: "auto",
        pr: 0.5,
      }}
    >
      {characters.map((character) => {
        if (!character.class) {
          return null;
        }

        const hasMain = Boolean(character.mainSpec);
        const hasOff = Boolean(character.offSpec);
        const hasNoSpecs = !hasMain && !hasOff;

        return (
          <Box key={character.id} sx={{ display: "contents" }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, whiteSpace: "nowrap" }}
            >
              {character.name}
            </Typography>
            <SpecCell>
              {hasMain && character.mainSpec ? (
                <GearPickSpecRadio
                  character={character}
                  specGear={character.mainSpec}
                  side="main"
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
