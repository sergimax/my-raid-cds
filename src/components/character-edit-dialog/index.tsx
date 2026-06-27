import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { SubmitEvent } from "react";
import { useCallback, useMemo, useState, useEffect } from "react";
import type { CharacterGearItem } from "../../types/character-gear.ts";
import type { CharacterRecord, CharacterSpecGearUpdate } from "../../types/characters.ts";
import { useTranslation } from "../../i18n/use-translation.ts";
import { getLocalizedClassName } from "../../i18n/localized-domain.ts";
import {
  formatGearSummary,
  sortGearItemsBySlot,
} from "../../utils/format-stored-gear.ts";
import { summarizeGearItemLevels } from "../../utils/summarize-gear-item-levels.ts";
import { StoredGearItemLine } from "../stored-gear-item-line/index.tsx";
import {
  characterSpecGearFormValues,
  parseCharacterSpecGearFields,
} from "../../utils/validate-character.ts";
import { characterNameDisplaySx } from "../../utils/character-display.ts";
import { parseWowSimsExporterJson } from "../../utils/parse-wowsims-exporter.ts";
import { hideExternalWowTooltips } from "../../utils/hide-external-wow-tooltips.ts";
import { CharacterSpecGearFields } from "../character-spec-gear-fields/index.tsx";
import { FormErrorMessage } from "../form-error-message/index.tsx";

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
  const [gearItems, setGearItems] = useState<CharacterGearItem[] | undefined>(
    character.gearItems,
  );
  const [wowsimsImportText, setWowsimsImportText] = useState("");
  const [importNotice, setImportNotice] = useState("");
  const [error, setError] = useState("");

  const storedGearSummary = useMemo(() => {
    if (!gearItems || gearItems.length === 0) {
      return null;
    }
    return summarizeGearItemLevels(gearItems);
  }, [gearItems]);

  const sortedGearItems = useMemo(
    () => (gearItems ? sortGearItemsBySlot(gearItems) : []),
    [gearItems],
  );

  useEffect(() => () => hideExternalWowTooltips(), []);

  const handleImportGear = useCallback(() => {
    if (!character.class) {
      return;
    }

    setError("");
    setImportNotice("");

    const result = parseWowSimsExporterJson(
      wowsimsImportText,
      character.class.name,
      locale,
    );
    if (!result.ok) {
      setError(result.error);
      return;
    }

    setGearItems(result.gearItems);

    if (result.exportSpec) {
      if (!mainSpec || mainSpec === result.exportSpec) {
        setMainSpec(result.exportSpec);
      }
    }

    const noticeParts = [
      t("characterEdit.importedSummary", {
        summary: formatGearSummary(result.gearItems, locale),
      }),
    ];
    if (result.exportSpec) {
      noticeParts.push(
        t("characterEdit.importedSpec", { spec: result.exportSpec }),
      );
    }
    if (result.warnings.length > 0) {
      noticeParts.push(result.warnings.join(" "));
    }
    setImportNotice(noticeParts.join(" "));
    setWowsimsImportText("");
  }, [character.class, locale, mainSpec, t, wowsimsImportText]);

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
        mainSpec: result.mainSpec,
        offSpec: result.offSpec,
        gearItems,
      });
      onClose();
    },
    [
      character.class,
      character.id,
      gearItems,
      locale,
      mainGearScoreText,
      mainSpec,
      offGearScoreText,
      offSpec,
      onClose,
      onSave,
    ],
  );

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
              <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary">
                  {t("characterEdit.importGear")}
                </Typography>
                {storedGearSummary ? (
                  <Stack spacing={0.5}>
                    <Typography variant="body2">
                      {t("characterEdit.storedGear")}
                      {storedGearSummary.averageItemLevel !== undefined
                        ? t("characterEdit.avgIlvl", {
                            ilvl: storedGearSummary.averageItemLevel,
                          })
                        : ""}
                    </Typography>
                    <Box
                      component="ul"
                      sx={{ m: 0, pl: 2.5, maxHeight: 160, overflowY: "auto" }}
                    >
                      {sortedGearItems.map((item) => (
                        <Typography
                          key={`${item.slot}-${item.id}`}
                          component="li"
                          variant="body2"
                        >
                          <StoredGearItemLine item={item} />
                        </Typography>
                      ))}
                    </Box>
                    {storedGearSummary.unknownItemIds.length > 0 ? (
                      <Typography variant="caption" color="warning.main">
                        {t("characterEdit.unknownItemIds", {
                          count: storedGearSummary.unknownItemIds.length,
                        })}
                      </Typography>
                    ) : null}
                  </Stack>
                ) : null}
                <TextField
                  label={t("characterEdit.wseJson")}
                  value={wowsimsImportText}
                  onChange={(event) => {
                    setWowsimsImportText(event.target.value);
                    setError("");
                    setImportNotice("");
                  }}
                  multiline
                  minRows={4}
                  maxRows={10}
                  placeholder={t("characterEdit.wsePlaceholder")}
                  helperText={t("characterEdit.wseHelper")}
                  fullWidth
                />
                <Box>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={handleImportGear}
                    disabled={wowsimsImportText.trim() === ""}
                  >
                    {t("characterEdit.importButton")}
                  </Button>
                </Box>
                {importNotice ? (
                  <Typography variant="body2" color="success.main">
                    {importNotice}
                  </Typography>
                ) : null}
              </Stack>
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
