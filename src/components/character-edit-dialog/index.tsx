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
import type { CharacterRecord, CharacterSpecGearUpdate } from "../../types/characters.ts";
import { useTranslation } from "../../i18n/use-translation.ts";
import {
  characterSpecGearFormValues,
  parseCharacterSpecGearFields,
} from "../../utils/validate-character.ts";
import { characterNameDisplaySx } from "../../utils/character-display.ts";
import { hideExternalWowTooltips } from "../../utils/hide-external-wow-tooltips.ts";
import { ClassOptionLabel } from "../class-option-label/index.tsx";
import { FormErrorMessage } from "../form-error-message/index.tsx";
import { CharacterSpecGearColumn } from "./character-spec-gear-column.tsx";
import {
  attachGearToSpec,
  gearItemsForSpecSave,
  initialGearLoadedForSpec,
} from "./character-edit-spec-gear.ts";

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
  const [mainGearLoadedForSpec, setMainGearLoadedForSpec] = useState(() =>
    initialGearLoadedForSpec(character.mainSpec),
  );
  const [offGearItems, setOffGearItems] = useState<
    CharacterGearItem[] | undefined
  >(character.offSpec?.gearItems);
  const [offGearLoadedForSpec, setOffGearLoadedForSpec] = useState(() =>
    initialGearLoadedForSpec(character.offSpec),
  );
  const [error, setError] = useState("");

  useEffect(() => () => hideExternalWowTooltips(), []);

  const handleMainSpecChange = useCallback((value: string) => {
    setMainSpec(value);
    if (value !== mainGearLoadedForSpec) {
      setMainGearItems(undefined);
      setMainGearLoadedForSpec("");
    }
    setError("");
  }, [mainGearLoadedForSpec]);

  const handleOffSpecChange = useCallback((value: string) => {
    setOffSpec(value);
    if (value !== offGearLoadedForSpec) {
      setOffGearItems(undefined);
      setOffGearLoadedForSpec("");
    }
    setError("");
  }, [offGearLoadedForSpec]);

  const handleMainGearItemsChange = useCallback(
    (gearItems: CharacterGearItem[] | undefined) => {
      setMainGearItems(gearItems);
      setMainGearLoadedForSpec(
        gearItems && gearItems.length > 0 ? mainSpec : "",
      );
    },
    [mainSpec],
  );

  const handleOffGearItemsChange = useCallback(
    (gearItems: CharacterGearItem[] | undefined) => {
      setOffGearItems(gearItems);
      setOffGearLoadedForSpec(
        gearItems && gearItems.length > 0 ? offSpec : "",
      );
    },
    [offSpec],
  );

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
        mainSpec: attachGearToSpec(
          result.mainSpec,
          gearItemsForSpecSave(
            result.mainSpec?.spec,
            mainGearItems,
            mainGearLoadedForSpec,
          ),
        ),
        offSpec: attachGearToSpec(
          result.offSpec,
          gearItemsForSpecSave(
            result.offSpec?.spec,
            offGearItems,
            offGearLoadedForSpec,
          ),
        ),
      });
      onClose();
    },
    [
      character.class,
      character.id,
      locale,
      mainGearItems,
      mainGearLoadedForSpec,
      mainGearScoreText,
      mainSpec,
      offGearItems,
      offGearLoadedForSpec,
      offGearScoreText,
      offSpec,
      onClose,
      onSave,
    ],
  );

  const mainSpecLabel = t("characterEdit.mainSpecGear");
  const offSpecLabel = t("characterEdit.offSpecGear");

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
              <ClassOptionLabel
                characterClass={character.class}
                variant="body2"
                iconSize={18}
              />
            ) : null}
          </Box>
          {character.class ? (
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={{ xs: 2, md: 3 }}
              divider={
                <Divider
                  flexItem
                  orientation="vertical"
                  sx={{ display: { xs: "none", md: "block" } }}
                />
              }
              sx={{ alignItems: "stretch" }}
            >
              <CharacterSpecGearColumn
                roleLabel={t("characterForm.main")}
                importSectionLabel={mainSpecLabel}
                spec={mainSpec}
                gearScoreText={mainGearScoreText}
                specName="mainSpec"
                gearScoreName="mainGearScore"
                specLabelId="character-main-spec-label"
                characterClass={character.class}
                gearItems={mainGearItems}
                onSpecChange={handleMainSpecChange}
                onGearScoreTextChange={(value) => {
                  setMainGearScoreText(value);
                  setError("");
                }}
                onGearItemsChange={handleMainGearItemsChange}
                onError={setError}
                onClearError={() => setError("")}
                locale={locale}
                t={t}
              />
              <CharacterSpecGearColumn
                roleLabel={t("characterForm.off")}
                importSectionLabel={offSpecLabel}
                spec={offSpec}
                gearScoreText={offGearScoreText}
                specName="offSpec"
                gearScoreName="offGearScore"
                specLabelId="character-off-spec-label"
                characterClass={character.class}
                gearItems={offGearItems}
                onSpecChange={handleOffSpecChange}
                onGearScoreTextChange={(value) => {
                  setOffGearScoreText(value);
                  setError("");
                }}
                onGearItemsChange={handleOffGearItemsChange}
                onError={setError}
                onClearError={() => setError("")}
                locale={locale}
                t={t}
              />
            </Stack>
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
    <Dialog open={character !== null} onClose={onClose} maxWidth="lg" fullWidth>
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
