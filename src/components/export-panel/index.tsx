import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { buildExportStatusString } from "../../utils/build-export-status.ts";
import type { ExportPanelProps } from "./types.ts";

export function ExportPanel({
  characters,
  visibleDungeons,
  dungeonToggles,
  onClose,
}: ExportPanelProps) {
  const characterIds = useMemo(
    () => new Set(characters.map((character) => character.id)),
    [characters],
  );

  const [deselectedCharacterIds, setDeselectedCharacterIds] = useState<
    Set<string>
  >(() => new Set());

  const selectedCharacterIds = useMemo(() => {
    const selected = new Set<string>();
    for (const characterId of characterIds) {
      if (!deselectedCharacterIds.has(characterId)) {
        selected.add(characterId);
      }
    }
    return selected;
  }, [characterIds, deselectedCharacterIds]);

  const selectedCharacters = useMemo(
    () => characters.filter((character) => selectedCharacterIds.has(character.id)),
    [characters, selectedCharacterIds],
  );

  const statusText = useMemo(
    () =>
      buildExportStatusString({
        characters: selectedCharacters,
        dungeons: visibleDungeons,
        dungeonToggles,
      }),
    [dungeonToggles, selectedCharacters, visibleDungeons],
  );

  const toggleCharacter = (characterId: string, checked: boolean) => {
    setDeselectedCharacterIds((previous) => {
      const next = new Set(previous);
      if (checked) {
        next.delete(characterId);
      } else {
        next.add(characterId);
      }
      return next;
    });
  };

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Export
      </Typography>
      <Stack spacing={2} sx={{ maxWidth: 640 }}>
        <Typography variant="body2" color="text.secondary">
          Filter dungeons with the table search, then copy lines below — one per
          matching raid listing characters still without CD (toggle off).
        </Typography>
        {characters.length > 0 ? (
          <FormGroup row sx={{ gap: 1 }}>
            {characters.map((character) => (
              <FormControlLabel
                key={character.id}
                control={
                  <Checkbox
                    size="small"
                    checked={selectedCharacterIds.has(character.id)}
                    onChange={(event) => {
                      toggleCharacter(character.id, event.target.checked);
                    }}
                  />
                }
                label={character.name}
              />
            ))}
          </FormGroup>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Add a character to build a status summary.
          </Typography>
        )}
        <TextField
          label="Export text"
          value={statusText}
          multiline
          minRows={4}
          maxRows={16}
          slotProps={{
            input: {
              readOnly: true,
            },
            htmlInput: {
              "aria-label": "Characters without CD per dungeon, for copy",
            },
          }}
          onFocus={(event) => {
            event.target.select();
          }}
        />
        <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
          <Button variant="text" type="button" onClick={onClose}>
            Close
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
