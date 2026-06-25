import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import type { CharacterRecord, CharacterSpecGear } from "../../types/characters.ts";
import {
  characterHasExportSpecs,
  isCharacterIncludedInExport,
  resolveExportSpecSelection,
  type CharacterExportSpecSelection,
} from "../../utils/format-character-export.ts";
import { buildExportStatusString } from "../../utils/build-export-status.ts";
import { CharacterSpecGearLabel } from "../spec-option-label/index.tsx";
import type { ExportPanelProps } from "./types.ts";

type StoredExportSpecSelection = Partial<CharacterExportSpecSelection>;

type ExportSpecCheckboxProps = {
  character: CharacterRecord;
  specGear: CharacterSpecGear;
  slot: keyof CharacterExportSpecSelection;
  checked: boolean;
  onCheckedChange: (
    slot: keyof CharacterExportSpecSelection,
    included: boolean,
  ) => void;
};

function ExportSpecCheckbox({
  character,
  specGear,
  slot,
  checked,
  onCheckedChange,
}: ExportSpecCheckboxProps) {
  if (!character.class) {
    return null;
  }

  return (
    <FormControlLabel
      control={
        <Checkbox
          size="small"
          checked={checked}
          onChange={(event) => {
            onCheckedChange(slot, event.target.checked);
          }}
          slotProps={{
            input: {
              "aria-label": `Include ${specGear.spec} for ${character.name}`,
            },
          }}
        />
      }
      label={
        <CharacterSpecGearLabel
          characterClass={character.class}
          spec={specGear.spec}
          gearScore={specGear.gearScore}
          iconSize={18}
          showSpecName={false}
        />
      }
      sx={{ mr: 0 }}
    />
  );
}

export function ExportPanel({
  characters,
  visibleDungeons,
  dungeonToggles,
  onClose,
}: ExportPanelProps) {
  const [exportSpecSelectionByCharacterId, setExportSpecSelectionByCharacterId] =
    useState<Record<string, StoredExportSpecSelection>>({});

  const includedCharacters = useMemo(
    () =>
      characters.filter((character) =>
        isCharacterIncludedInExport(
          character,
          resolveExportSpecSelection(
            character,
            exportSpecSelectionByCharacterId,
          ),
        ),
      ),
    [characters, exportSpecSelectionByCharacterId],
  );

  const statusText = useMemo(
    () =>
      buildExportStatusString({
        characters: includedCharacters,
        dungeons: visibleDungeons,
        dungeonToggles,
        exportSpecSelectionByCharacterId,
      }),
    [
      dungeonToggles,
      exportSpecSelectionByCharacterId,
      includedCharacters,
      visibleDungeons,
    ],
  );

  const setSpecIncluded = (
    character: CharacterRecord,
    slot: keyof CharacterExportSpecSelection,
    included: boolean,
  ) => {
    setExportSpecSelectionByCharacterId((previous) => {
      const resolved = resolveExportSpecSelection(character, previous);
      return {
        ...previous,
        [character.id]: {
          ...previous[character.id],
          includeMain:
            slot === "includeMain" ? included : resolved.includeMain,
          includeOff: slot === "includeOff" ? included : resolved.includeOff,
          includeWithoutSpec:
            slot === "includeWithoutSpec"
              ? included
              : resolved.includeWithoutSpec,
        },
      };
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
          matching raid listing characters still without CD (toggle off). Check
          which specs to include for each character.
        </Typography>
        {characters.length > 0 ? (
          <Stack spacing={1}>
            {characters.map((character) => {
              const selection = resolveExportSpecSelection(
                character,
                exportSpecSelectionByCharacterId,
              );
              const hasSpecs = characterHasExportSpecs(character);
              return (
                <Stack
                  key={character.id}
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: "center", flexWrap: "wrap", gap: 1 }}
                >
                  <Typography
                    variant="body2"
                    sx={{ minWidth: 72, fontWeight: 600 }}
                  >
                    {character.name}
                  </Typography>
                  {character.mainSpec ? (
                    <ExportSpecCheckbox
                      character={character}
                      specGear={character.mainSpec}
                      slot="includeMain"
                      checked={selection.includeMain}
                      onCheckedChange={(slot, included) => {
                        setSpecIncluded(character, slot, included);
                      }}
                    />
                  ) : null}
                  {character.offSpec ? (
                    <ExportSpecCheckbox
                      character={character}
                      specGear={character.offSpec}
                      slot="includeOff"
                      checked={selection.includeOff}
                      onCheckedChange={(slot, included) => {
                        setSpecIncluded(character, slot, included);
                      }}
                    />
                  ) : null}
                  {!hasSpecs ? (
                    <Checkbox
                      size="small"
                      checked={selection.includeWithoutSpec}
                      onChange={(event) => {
                        setSpecIncluded(
                          character,
                          "includeWithoutSpec",
                          event.target.checked,
                        );
                      }}
                      slotProps={{
                        input: {
                          "aria-label": `Include ${character.name} in export`,
                        },
                      }}
                    />
                  ) : null}
                </Stack>
              );
            })}
          </Stack>
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
