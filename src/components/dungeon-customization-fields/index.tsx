import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import {
  EMBLEM_OPTIONS,
  emblemIcons,
  emblemLabels,
  type EmblemKey,
} from "../../assets/emblems/emblem-icons.ts";
import { MAX_DUNGEON_SHORT_NAME_LENGTH } from "../../constants/dungeon-form-defaults.ts";
import {
  DungeonDifficulty,
  DungeonSizes,
  type DungeonDifficulty as DungeonDifficultyValue,
  type DungeonSize,
} from "../../types/dungeons.ts";

export type DungeonCustomizationFieldsProps = {
  name: string;
  shortName: string;
  size: DungeonSize;
  difficulty: DungeonDifficultyValue;
  emblem: EmblemKey | "";
  onNameChange: (name: string) => void;
  onShortNameChange: (shortName: string) => void;
  onSizeChange: (size: DungeonSize) => void;
  onDifficultyChange: (difficulty: DungeonDifficultyValue) => void;
  onEmblemChange: (emblem: EmblemKey | "") => void;
};

export function DungeonCustomizationFields({
  name,
  shortName,
  size,
  difficulty,
  emblem,
  onNameChange,
  onShortNameChange,
  onSizeChange,
  onDifficultyChange,
  onEmblemChange,
}: DungeonCustomizationFieldsProps) {
  return (
    <Stack spacing={2}>
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
      <TextField
        label="Short name"
        name="dungeonShortName"
        value={shortName}
        onChange={(event) => {
          onShortNameChange(event.target.value);
        }}
        helperText="Optional abbreviation shown in compact table view. Leave blank to use a default for known raids."
        slotProps={{ htmlInput: { maxLength: MAX_DUNGEON_SHORT_NAME_LENGTH } }}
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
      <FormControl>
        <InputLabel id="dungeon-difficulty-label">Mode</InputLabel>
        <Select
          labelId="dungeon-difficulty-label"
          label="Mode"
          name="dungeonDifficulty"
          value={difficulty}
          onChange={(event) => {
            onDifficultyChange(event.target.value as DungeonDifficultyValue);
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
      <FormControl>
        <InputLabel id="dungeon-emblem-label">Badge</InputLabel>
        <Select
          labelId="dungeon-emblem-label"
          label="Badge"
          name="dungeonEmblem"
          value={emblem}
          onChange={(event) => {
            onEmblemChange(event.target.value as EmblemKey | "");
          }}
          renderValue={(selected) => {
            if (!selected) {
              return "None";
            }
            return (
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <Box
                  component="img"
                  src={emblemIcons[selected]}
                  alt=""
                  sx={{ width: 18, height: 18, borderRadius: "4px" }}
                />
                <span>{emblemLabels[selected]}</span>
              </Stack>
            );
          }}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {EMBLEM_OPTIONS.map((emblemKey) => (
            <MenuItem key={emblemKey} value={emblemKey}>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <Box
                  component="img"
                  src={emblemIcons[emblemKey]}
                  alt=""
                  sx={{ width: 18, height: 18, borderRadius: "4px" }}
                />
                <span>{emblemLabels[emblemKey]}</span>
              </Stack>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
}
