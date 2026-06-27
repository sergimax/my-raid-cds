import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import type { SubmitEvent } from "react";
import { useCallback, useState } from "react";
import type { EmblemKey } from "../../assets/emblems/emblem-icons.ts";
import { useTranslation } from "../../i18n/use-translation.ts";
import type {
  DungeonCustomizationUpdate,
  DungeonRecord,
  DungeonDifficulty as DungeonDifficultyValue,
  DungeonSize,
} from "../../types/dungeons.ts";
import {
  dungeonCustomizationFormValues,
  parseDungeonCustomizationForm,
} from "../../utils/validate-dungeon.ts";
import { DungeonCustomizationFields } from "../dungeon-customization-fields/index.tsx";
import { FormErrorMessage } from "../form-error-message/index.tsx";

type DungeonEditDialogProps = {
  dungeon: DungeonRecord | null;
  onClose: () => void;
  onSave: (dungeonId: string, customization: DungeonCustomizationUpdate) => void;
};

type DungeonEditDialogContentProps = {
  dungeon: DungeonRecord;
  onClose: () => void;
  onSave: (dungeonId: string, customization: DungeonCustomizationUpdate) => void;
};

function DungeonEditDialogContent({
  dungeon,
  onClose,
  onSave,
}: DungeonEditDialogContentProps) {
  const { t, locale } = useTranslation();
  const initialValues = dungeonCustomizationFormValues(dungeon);
  const [name, setName] = useState(initialValues.name);
  const [shortName, setShortName] = useState(initialValues.shortName);
  const [size, setSize] = useState<DungeonSize>(initialValues.size);
  const [difficulty, setDifficulty] = useState<DungeonDifficultyValue>(
    initialValues.difficulty,
  );
  const [emblem, setEmblem] = useState<EmblemKey | "">(initialValues.emblem);
  const [error, setError] = useState("");

  const handleSubmit = useCallback(
    (event: SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();
      setError("");
      const result = parseDungeonCustomizationForm(
        {
          name,
          shortName,
          size,
          difficulty,
          emblem,
        },
        locale,
      );
      if (!result.ok) {
        setError(result.error);
        return;
      }
      onSave(dungeon.id, result.fields);
      onClose();
    },
    [difficulty, dungeon.id, emblem, locale, name, onClose, onSave, shortName, size],
  );

  return (
    <form onSubmit={handleSubmit} noValidate>
      <DialogTitle>{t("dungeonEdit.title")}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <DungeonCustomizationFields
            name={name}
            shortName={shortName}
            size={size}
            difficulty={difficulty}
            emblem={emblem}
            onNameChange={(value) => {
              setName(value);
              setError("");
            }}
            onShortNameChange={(value) => {
              setShortName(value);
              setError("");
            }}
            onSizeChange={(value) => {
              setSize(value);
              setError("");
            }}
            onDifficultyChange={(value) => {
              setDifficulty(value);
              setError("");
            }}
            onEmblemChange={(value) => {
              setEmblem(value);
              setError("");
            }}
          />
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

export function DungeonEditDialog({
  dungeon,
  onClose,
  onSave,
}: DungeonEditDialogProps) {
  return (
    <Dialog open={dungeon !== null} onClose={onClose} maxWidth="sm" fullWidth>
      {dungeon ? (
        <DungeonEditDialogContent
          key={dungeon.id}
          dungeon={dungeon}
          onClose={onClose}
          onSave={onSave}
        />
      ) : null}
    </Dialog>
  );
}
