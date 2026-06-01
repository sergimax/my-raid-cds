import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { MAX_CHARACTER_NAME_LENGTH } from "../../constants/character.ts";
import { Classes } from "../../types/characters.ts";
import { ClassOptionLabel } from "../class-option-label/index.tsx";
import { FormActionsRow } from "../form-actions-row/index.tsx";
import { FormErrorMessage } from "../form-error-message/index.tsx";
import type { CharacterFormProps } from "./types.ts";

export function CharacterForm({
  name,
  characterClass,
  error,
  onNameChange,
  onClassChange,
  onCancel,
  onSubmit,
}: CharacterFormProps) {

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        New character
      </Typography>
      <form onSubmit={onSubmit} noValidate>
        <Stack spacing={2} sx={{ maxWidth: 480 }}>
          <TextField
            label="Name"
            name="characterName"
            value={name}
            onChange={(event) => {
              onNameChange(event.target.value);
            }}
            required
            autoComplete="off"
            slotProps={{
              htmlInput: { maxLength: MAX_CHARACTER_NAME_LENGTH },
            }}
            helperText={`${name.length}/${MAX_CHARACTER_NAME_LENGTH}`}
          />
          <FormControl required>
            <InputLabel id="character-class-label">Class</InputLabel>
            <Select
              labelId="character-class-label"
              label="Class"
              name="characterClass"
              value={characterClass === "" ? "" : characterClass.name}
              renderValue={(selectedName) => {
                if (!selectedName) {
                  return "";
                }
                const selectedClass = Classes.find(
                  (option) => option.name === selectedName,
                );
                if (!selectedClass) {
                  return selectedName;
                }
                return <ClassOptionLabel characterClass={selectedClass} />;
              }}
              onChange={(event) => {
                const selectedName = event.target.value;
                const selectedClass = Classes.find(
                  (option) => option.name === selectedName,
                );
                onClassChange(selectedClass ?? "");
              }}
            >
              {Classes.map((option) => (
                <MenuItem key={option.name} value={option.name}>
                  <ClassOptionLabel characterClass={option} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormActionsRow submitLabel="Add character" onCancel={onCancel} />
          {error ? <FormErrorMessage message={error} /> : null}
        </Stack>
      </form>
    </Box>
  );
}
