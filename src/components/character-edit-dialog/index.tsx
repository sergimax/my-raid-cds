import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import type { SubmitEvent } from "react";
import { useCallback, useState, useEffect } from "react";
import type { CharacterGearItem } from "../../types/character-gear.ts";
import type {
  CharacterRecord,
  CharacterSpecGear,
  CharacterSpecGearUpdate,
} from "../../types/characters.ts";
import { useTranslation } from "../../i18n/use-translation.ts";
import { getLocalizedClassName, getLocalizedSpecName } from "../../i18n/localized-domain.ts";
import {
  characterSpecGearFormValues,
  parseCharacterSpecGearFields,
} from "../../utils/validate-character.ts";
import { characterNameDisplaySx } from "../../utils/character-display.ts";
import { hideExternalWowTooltips } from "../../utils/hide-external-wow-tooltips.ts";
import { CharacterSpecGearFields } from "../character-spec-gear-fields/index.tsx";
import { FormErrorMessage } from "../form-error-message/index.tsx";
import { CharacterSpecGearImportSection } from "./character-spec-gear-import-section.tsx";

type CharacterEditDialogProps = {
  character: CharacterRecord | null;
  onClose: () => void;
  onSave: (characterId: string, specGear: CharacterSpecGearUpdate) => void;
};

type CharacterEditDialogContentProps = {
  character: CharacterRecord;
  onClose: () => void;
  onSave: (characterId: string, specGear: CharacterSpecGearUpdate) => void;
};

function attachGearToSpec(
  specGear: CharacterSpecGear | undefined,
  gearItems: CharacterGearItem[] | undefined,
): CharacterSpecGear | undefined {
  if (!specGear) {
    return undefined;
  }
  const next: CharacterSpecGear = { spec: specGear.spec };
  if (specGear.gearScore !== undefined) {
    next.gearScore = specGear.gearScore;
  }
  if (gearItems && gearItems.length > 0) {
    next.gearItems = gearItems;
  }
  return next;
}

function CharacterEditDialogContent({
  character,
  onClose,
  onSave,
}: CharacterEditDialogContentProps) {
  const { t, locale } = useTranslation();
  const initialValues = characterSpecGearFormValues(character);
  const [mainSpec, setMainSpec] = useState(initialValues.mainSpec);
  const [mainGearScoreText, setMainGearScoreText] = useState(
    initialValues.mainGearScoreText,
  );
  const [offSpec, setOffSpec] = useState(initialValues.offSpec);
  const [offGearScoreText, setOffGearScoreText] = useState(
    initialValues.offGearScoreText,
  );
  const [mainGearItems, setMainGearItems] = useState<
    CharacterGearItem[] | undefined
  >(character.mainSpec?.gearItems);
  const [offGearItems, setOffGearItems] = useState<
    CharacterGearItem[] | undefined
  >(character.offSpec?.gearItems);
  const [error, setError] = useState("");

  useEffect(() => () => hideExternalWowTooltips(), []);

  const handleSubmit = useCallback(
    (event: SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!character.class) {
        return;
      }
      setError("");
      const result = parseCharacterSpecGearFields(
        { mainSpec, mainGearScoreText, offSpec, offGearScoreText },
        character.class,
        locale,
      );
      if (!result.ok) {
        setError(result.error);
        return;
      }
      onSave(character.id, {
        mainSpec: attachGearToSpec(result.mainSpec, mainGearItems),
        offSpec: attachGearToSpec(result.offSpec, offGearItems),
      });
      onClose();
    },
    [
      character.class,
      character.id,
      locale,
      mainGearItems,
      mainGearScoreText,
      mainSpec,
      offGearItems,
      offGearScoreText,
      offSpec,
      onClose,
      onSave,
    ],
  );

  const mainSpecLabel =
    mainSpec && character.class
      ? getLocalizedSpecName(character.class.name, mainSpec, locale)
      : t("characterEdit.mainSpecGear");
  const offSpecLabel =
    offSpec && character.class
      ? getLocalizedSpecName(character.class.name, offSpec, locale)
      : t("characterEdit.offSpecGear");

  return (
    <form onSubmit={handleSubmit} noValidate>
      <DialogTitle>{t("characterEdit.title")}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Box>
            <Typography
              variant="subtitle1"
              sx={characterNameDisplaySx(character.class)}
            >
              {character.name}
            </Typography>
            {character.class ? (
              <Typography variant="body2" color="text.secondary">
                {getLocalizedClassName(character.class.name, locale)}
              </Typography>
            ) : null}
          </Box>
          {character.class ? (
            <>
              <CharacterSpecGearFields
                characterClass={character.class}
                mainSpec={mainSpec}
                mainGearScoreText={mainGearScoreText}
                offSpec={offSpec}
                offGearScoreText={offGearScoreText}
                onMainSpecChange={(value) => {
                  setMainSpec(value);
                  setError("");
                }}
                onMainGearScoreTextChange={(value) => {
                  setMainGearScoreText(value);
                  setError("");
                }}
                onOffSpecChange={(value) => {
                  setOffSpec(value);
                  setError("");
                }}
                onOffGearScoreTextChange={(value) => {
                  setOffGearScoreText(value);
                  setError("");
                }}
              />
              <Typography variant="body2" color="text.secondary">
                {t("characterEdit.importGear")}
              </Typography>
              <CharacterSpecGearImportSection
                label={mainSpecLabel}
                characterClass={character.class}
                gearItems={mainGearItems}
                onGearItemsChange={setMainGearItems}
                onError={setError}
                onClearError={() => setError("")}
                locale={locale}
                t={t}
              />
              {offSpec ? (
                <>
                  <Divider />
                  <CharacterSpecGearImportSection
                    label={offSpecLabel}
                    characterClass={character.class}
                    gearItems={offGearItems}
                    onGearItemsChange={setOffGearItems}
                    onError={setError}
                    onClearError={() => setError("")}
                    locale={locale}
                    t={t}
                  />
                </>
              ) : null}
            </>
          ) : null}
          {error ? <FormErrorMessage message={error} /> : null}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("common.cancel")}</Button>
        <Button type="submit" variant="contained">
          {t("common.save")}
        </Button>
      </DialogActions>
    </form>
  );
}

export function CharacterEditDialog({
  character,
  onClose,
  onSave,
}: CharacterEditDialogProps) {
  return (
    <Dialog open={character !== null} onClose={onClose} maxWidth="sm" fullWidth>
      {character ? (
        <CharacterEditDialogContent
          key={character.id}
          character={character}
          onClose={onClose}
          onSave={onSave}
        />
      ) : null}
    </Dialog>
  );
}
