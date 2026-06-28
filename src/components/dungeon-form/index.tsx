import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { MAX_DUNGEON_SHORT_NAME_LENGTH } from "../../constants/dungeon-form-defaults.ts";
import { useTranslation } from "../../i18n/use-translation.ts";
import { getLocalizedDifficulty } from "../../i18n/localized-domain.ts";
import {
  DungeonDifficulty,
  DungeonSizes,
  type DungeonDifficulty as DungeonDifficultyValue,
  type DungeonSize,
} from "../../types/dungeons.ts";
import { FormActionsRow } from "../form-actions-row/index.tsx";
import { FormErrorMessage } from "../form-error-message/index.tsx";
import type { DungeonFormProps } from "./types.ts";

export function DungeonForm({
  name,
  shortName,
  size,
  itemLevelText,
  difficulty,
  error,
  onNameChange,
  onShortNameChange,
  onSizeChange,
  onItemLevelTextChange,
  onDifficultyChange,
  onSubmit,
}: DungeonFormProps) {
  const { t, locale } = useTranslation();

  return (
    <form onSubmit={onSubmit} noValidate>
      <Stack spacing={2} sx={{ maxWidth: 480 }}>
        <TextField
          label={t("common.name")}
          name="dungeonName"
          value={name}
          onChange={(event) => {
            onNameChange(event.target.value);
          }}
          required
          autoComplete="off"
        />
        <TextField
          label={t("dungeonForm.shortName")}
          name="dungeonShortName"
          value={shortName}
          onChange={(event) => {
            onShortNameChange(event.target.value);
          }}
          helperText={t("dungeonForm.shortNameHelper")}
          slotProps={{ htmlInput: { maxLength: MAX_DUNGEON_SHORT_NAME_LENGTH } }}
          autoComplete="off"
        />
        <FormControl required>
          <InputLabel id="dungeon-size-label">{t("common.size")}</InputLabel>
          <Select
            labelId="dungeon-size-label"
            label={t("common.size")}
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
          label={t("dungeonForm.itemLevels")}
          name="dungeonItemLevels"
          value={itemLevelText}
          onChange={(event) => {
            onItemLevelTextChange(event.target.value);
          }}
          helperText={t("dungeonForm.itemLevelsHelper")}
          required
          autoComplete="off"
        />
        <FormControl>
          <InputLabel id="dungeon-difficulty-label">
            {t("dungeonForm.difficulty")}
          </InputLabel>
          <Select
            labelId="dungeon-difficulty-label"
            label={t("dungeonForm.difficulty")}
            name="dungeonDifficulty"
            value={difficulty}
            onChange={(event) => {
              onDifficultyChange(
                event.target.value as DungeonDifficultyValue,
              );
            }}
          >
            <MenuItem value={DungeonDifficulty.NORMAL}>
              {getLocalizedDifficulty(DungeonDifficulty.NORMAL, locale)}
            </MenuItem>
            <MenuItem value={DungeonDifficulty.HEROIC}>
              {getLocalizedDifficulty(DungeonDifficulty.HEROIC, locale)}
            </MenuItem>
          </Select>
        </FormControl>
        <FormActionsRow submitLabel={t("dungeonForm.addDungeon")} />
        {error ? <FormErrorMessage message={error} /> : null}
      </Stack>
    </form>
  );
}
