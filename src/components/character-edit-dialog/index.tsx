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
import { useCallback, useMemo, useState } from "react";
import type { CharacterGearItem } from "../../types/character-gear.ts";
import type { CharacterRecord, CharacterSpecGearUpdate } from "../../types/characters.ts";
import { summarizeGearItemLevels } from "../../utils/summarize-gear-item-levels.ts";
import {
  characterSpecGearFormValues,
  parseCharacterSpecGearFields,
} from "../../utils/validate-character.ts";
import { characterNameDisplaySx } from "../../utils/character-display.ts";
import { parseWowSimsExporterJson } from "../../utils/parse-wowsims-exporter.ts";
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

function formatGearSummary(gearItems: CharacterGearItem[]): string {
  const summary = summarizeGearItemLevels(gearItems);
  const parts = [`${summary.equippedCount} items`];
  if (summary.averageItemLevel !== undefined) {
    parts.push(`avg ilvl ${summary.averageItemLevel}`);
  }
  if (summary.unknownItemIds.length > 0) {
    parts.push(`${summary.unknownItemIds.length} unknown item id(s)`);
  }
  return parts.join(" · ");
}

function CharacterEditDialogContent({
  character,
  onClose,
  onSave,
}: CharacterEditDialogContentProps) {
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

  const gearSummaryText = useMemo(
    () => (gearItems && gearItems.length > 0 ? formatGearSummary(gearItems) : ""),
    [gearItems],
  );

  const handleImportGear = useCallback(() => {
    if (!character.class) {
      return;
    }

    setError("");
    setImportNotice("");

    const result = parseWowSimsExporterJson(
      wowsimsImportText,
      character.class.name,
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

    const noticeParts = [`Imported ${formatGearSummary(result.gearItems)}.`];
    if (result.exportSpec) {
      noticeParts.push(`Spec: ${result.exportSpec}.`);
    }
    if (result.warnings.length > 0) {
      noticeParts.push(result.warnings.join(" "));
    }
    setImportNotice(noticeParts.join(" "));
    setWowsimsImportText("");
  }, [character.class, mainSpec, wowsimsImportText]);

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
      <DialogTitle>Edit character details</DialogTitle>
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
                {character.class.name}
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
                  Import gear from WowSimsExporter
                </Typography>
                {gearSummaryText ? (
                  <Typography variant="body2">
                    Stored gear: {gearSummaryText}
                  </Typography>
                ) : null}
                <TextField
                  label="WowSimsExporter JSON"
                  value={wowsimsImportText}
                  onChange={(event) => {
                    setWowsimsImportText(event.target.value);
                    setError("");
                    setImportNotice("");
                  }}
                  multiline
                  minRows={4}
                  maxRows={10}
                  placeholder='Paste output from /wse export'
                  helperText="Imports equipped items (item ids, enchants, gems). Gear score stays manual."
                  fullWidth
                />
                <Box>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={handleImportGear}
                    disabled={wowsimsImportText.trim() === ""}
                  >
                    Import gear
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
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained">
          Save
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
