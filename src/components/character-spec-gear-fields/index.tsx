import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { specsForClass } from "../../data/class-specs.ts";
import { useTranslation } from "../../i18n/use-translation.ts";
import type { CharacterClass } from "../../types/characters.ts";
import { SpecOptionLabel } from "../spec-option-label/index.tsx";

export type CharacterSpecGearFieldsProps = {
  characterClass: CharacterClass | "";
  mainSpec: string;
  mainGearScoreText: string;
  offSpec: string;
  offGearScoreText: string;
  onMainSpecChange: (value: string) => void;
  onMainGearScoreTextChange: (value: string) => void;
  onOffSpecChange: (value: string) => void;
  onOffGearScoreTextChange: (value: string) => void;
};

export type CharacterSingleSpecGearFieldsProps = {
  label: string;
  spec: string;
  gearScoreText: string;
  specName: string;
  gearScoreName: string;
  specLabelId: string;
  characterClass: CharacterClass | "";
  classSpecs: readonly string[];
  disabled: boolean;
  layout?: "row" | "column";
  onSpecChange: (value: string) => void;
  onGearScoreTextChange: (value: string) => void;
};

export function CharacterSingleSpecGearFields({
  label,
  spec,
  gearScoreText,
  specName,
  gearScoreName,
  specLabelId,
  characterClass,
  classSpecs,
  disabled,
  layout = "row",
  onSpecChange,
  onGearScoreTextChange,
}: CharacterSingleSpecGearFieldsProps) {
  const { t } = useTranslation();
  const fieldsDirection = layout === "column" ? "column" : { xs: "column", sm: "row" };

  return (
    <Stack spacing={0.5}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Stack direction={fieldsDirection} spacing={2}>
        <FormControl sx={{ flex: 1 }} disabled={disabled}>
          <InputLabel id={specLabelId}>{t("common.spec")}</InputLabel>
          <Select
            labelId={specLabelId}
            label={t("common.spec")}
            name={specName}
            value={spec}
            renderValue={(selected) => {
              if (!selected) {
                return <em>{t("common.none")}</em>;
              }
              if (characterClass === "") {
                return selected;
              }
              return (
                <SpecOptionLabel
                  className={characterClass.name}
                  spec={selected}
                />
              );
            }}
            onChange={(event) => {
              onSpecChange(event.target.value);
            }}
          >
            <MenuItem value="">
              <em>{t("common.none")}</em>
            </MenuItem>
            {classSpecs.map((option) => (
              <MenuItem key={option} value={option}>
                {characterClass === "" ? (
                  option
                ) : (
                  <SpecOptionLabel
                    className={characterClass.name}
                    spec={option}
                  />
                )}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label={t("characterForm.gearScore")}
          name={gearScoreName}
          value={gearScoreText}
          onChange={(event) => {
            onGearScoreTextChange(event.target.value);
          }}
          autoComplete="off"
          helperText={t("characterForm.gearScoreHelper")}
          disabled={disabled}
          sx={{ flex: 1 }}
        />
      </Stack>
    </Stack>
  );
}

export function CharacterSpecGearFields({
  characterClass,
  mainSpec,
  mainGearScoreText,
  offSpec,
  offGearScoreText,
  onMainSpecChange,
  onMainGearScoreTextChange,
  onOffSpecChange,
  onOffGearScoreTextChange,
}: CharacterSpecGearFieldsProps) {
  const { t } = useTranslation();
  const classSpecs =
    characterClass === "" ? [] : specsForClass(characterClass.name);
  const specsDisabled = characterClass === "";

  return (
    <Stack spacing={2}>
      <CharacterSingleSpecGearFields
        label={t("characterForm.main")}
        spec={mainSpec}
        gearScoreText={mainGearScoreText}
        specName="mainSpec"
        gearScoreName="mainGearScore"
        specLabelId="character-main-spec-label"
        characterClass={characterClass}
        classSpecs={classSpecs}
        disabled={specsDisabled}
        onSpecChange={onMainSpecChange}
        onGearScoreTextChange={onMainGearScoreTextChange}
      />
      <CharacterSingleSpecGearFields
        label={t("characterForm.off")}
        spec={offSpec}
        gearScoreText={offGearScoreText}
        specName="offSpec"
        gearScoreName="offGearScore"
        specLabelId="character-off-spec-label"
        characterClass={characterClass}
        classSpecs={classSpecs}
        disabled={specsDisabled}
        onSpecChange={onOffSpecChange}
        onGearScoreTextChange={onOffGearScoreTextChange}
      />
    </Stack>
  );
}
