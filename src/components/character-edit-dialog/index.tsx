import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import type { SubmitEvent } from "react";
import { useCallback, useState } from "react";
import type { CharacterRecord, CharacterSpecGearUpdate } from "../../types/characters.ts";
import {
  characterSpecGearFormValues,
  parseCharacterSpecGearFields,
} from "../../utils/validate-character.ts";
import { characterNameDisplaySx } from "../../utils/character-display.ts";
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
  const initialValues = characterSpecGearFormValues(character);
  const [mainSpec, setMainSpec] = useState(initialValues.mainSpec);
  const [mainGearScoreText, setMainGearScoreText] = useState(
    initialValues.mainGearScoreText,
  );
  const [offSpec, setOffSpec] = useState(initialValues.offSpec);
  const [offGearScoreText, setOffGearScoreText] = useState(
    initialValues.offGearScoreText,
  );
  const [error, setError] = useState("");

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
      });
      onClose();
    },
    [
      character.class,
      character.id,
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
