import { Box, FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material";
import { getLocalizedSpecName } from "../../i18n/localized-domain.ts";
import type { TranslateFn } from "../../i18n/translate.ts";
import { useTranslation } from "../../i18n/use-translation.ts";
import type { CharacterRecord } from "../../types/characters.ts";
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

export function GearPickCharacterSelect({
  characters,
  selection,
  onSelectionChange,
  t,
}: GearPickCharacterSelectProps) {
  const { locale } = useTranslation();
  const listMaxHeight = getExportFilterSpecsListMaxHeight();

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
        display: "flex",
        flexDirection: "column",
        gap: 0.75,
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
          <Box key={character.id} sx={{ display: "grid", gap: 0.25 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {character.name}
            </Typography>
            {hasMain && character.mainSpec ? (
              <FormControlLabel
                value={selectionValue({ characterId: character.id, side: "main" })}
                control={<Radio size="small" />}
                aria-label={t("gearPickPanel.selectSpecAria", {
                  name: character.name,
                  spec: getLocalizedSpecName(
                    character.class.name,
                    character.mainSpec.spec,
                    locale,
                  ),
                })}
                label={
                  <CharacterSpecGearLabel
                    characterClass={character.class}
                    spec={character.mainSpec.spec}
                    gearScore={character.mainSpec.gearScore}
                    iconSize={18}
                    showSpecName={false}
                    showDetailTooltip={false}
                  />
                }
                sx={{ mr: 0, ml: 0 }}
              />
            ) : null}
            {hasOff && character.offSpec ? (
              <FormControlLabel
                value={selectionValue({ characterId: character.id, side: "off" })}
                control={<Radio size="small" />}
                aria-label={t("gearPickPanel.selectSpecAria", {
                  name: character.name,
                  spec: getLocalizedSpecName(
                    character.class.name,
                    character.offSpec.spec,
                    locale,
                  ),
                })}
                label={
                  <CharacterSpecGearLabel
                    characterClass={character.class}
                    spec={character.offSpec.spec}
                    gearScore={character.offSpec.gearScore}
                    iconSize={18}
                    showSpecName={false}
                    showDetailTooltip={false}
                  />
                }
                sx={{ mr: 0, ml: 0 }}
              />
            ) : null}
            {hasNoSpecs ? (
              <Typography variant="caption" color="text.secondary">
                {t("common.none")}
              </Typography>
            ) : null}
          </Box>
        );
      })}
    </RadioGroup>
  );
}
