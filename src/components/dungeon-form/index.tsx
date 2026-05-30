import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  DungeonDifficulty,
  DungeonSizes,
  type DungeonDifficulty as DungeonDifficultyValue,
  type DungeonSize,
} from "../../types/dungeons.ts";
import type { DungeonFormProps } from "./types.ts";

export function DungeonForm({
  name,
  size,
  itemLevelText,
  difficulty,
  error,
  onNameChange,
  onSizeChange,
  onItemLevelTextChange,
  onDifficultyChange,
  onCancel,
  onSubmit,
}: DungeonFormProps) {
  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        New dungeon
      </Typography>
      <form onSubmit={onSubmit} noValidate>
        <Stack spacing={2} sx={{ maxWidth: 480 }}>
          <TextField
            label="Name"
            name="dungeonName"
            value={name}
            onChange={(event) => {
              onNameChange(event.target.value);
            }}
            required
            autoComplete="off"
          />
          <FormControl required>
            <InputLabel id="dungeon-size-label">Size</InputLabel>
            <Select
              labelId="dungeon-size-label"
              label="Size"
              name="dungeonSize"
              value={size}
              onChange={(event) => {
                onSizeChange(Number(event.target.value) as DungeonSize);
              }}
            >
              {DungeonSizes.map((sizeOption) => (
                <MenuItem key={sizeOption} value={sizeOption}>
                  {sizeOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Item levels"
            name="dungeonItemLevels"
            value={itemLevelText}
            onChange={(event) => {
              onItemLevelTextChange(event.target.value);
            }}
            helperText="One or more values, separated by / or comma (e.g. 200 or 200 / 213)."
            required
            autoComplete="off"
          />
          <FormControl>
            <InputLabel id="dungeon-difficulty-label">Difficulty</InputLabel>
            <Select
              labelId="dungeon-difficulty-label"
              label="Difficulty"
              name="dungeonDifficulty"
              value={difficulty}
              onChange={(event) => {
                onDifficultyChange(
                  event.target.value as DungeonDifficultyValue,
                );
              }}
            >
              <MenuItem value={DungeonDifficulty.NORMAL}>
                {DungeonDifficulty.NORMAL}
              </MenuItem>
              <MenuItem value={DungeonDifficulty.HEROIC}>
                {DungeonDifficulty.HEROIC}
              </MenuItem>
            </Select>
          </FormControl>
          <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
            <Button
              variant="text"
              type="button"
              onClick={(event) => {
                event.preventDefault();
                onCancel();
              }}
            >
              Cancel
            </Button>
            <Button variant="contained" color="primary" type="submit">
              Add dungeon
            </Button>
          </Stack>
          {error ? (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          ) : null}
        </Stack>
      </form>
    </Box>
  );
}
