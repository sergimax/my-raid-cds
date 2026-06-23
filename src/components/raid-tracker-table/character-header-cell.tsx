import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import {
  Box,
  IconButton,
  Stack,
  TableCell,
  TableSortLabel,
  Tooltip,
  Typography,
} from "@mui/material";
import { characterNameDisplaySx } from "../../utils/character-display.ts";
import {
  formatCharacterDetailsTooltip,
  formatCharacterSpecGearSummary,
} from "../../utils/format-character-details.ts";
import type { CharacterRecord } from "../../types/characters.ts";
import { CompletionCountChip } from "./dungeon-cells.tsx";
import type { SortDirection } from "../../utils/sort-dungeons.ts";
import { CHARACTER_HEADER_CELL_SX } from "./table-layout.ts";

type CharacterHeaderCellProps = {
  character: CharacterRecord;
  completedCount: number;
  dungeonCount: number;
  isActiveSort: boolean;
  sortDirection: SortDirection;
  onSort: () => void;
  onResetCharacterToggles: (characterId: string) => void;
  onEditCharacter: (characterId: string) => void;
  onDeleteCharacter: (characterId: string) => void;
};

export function CharacterHeaderCell({
  character,
  completedCount,
  dungeonCount,
  isActiveSort,
  sortDirection,
  onSort,
  onResetCharacterToggles,
  onEditCharacter,
  onDeleteCharacter,
}: CharacterHeaderCellProps) {
  const specGearSummary = formatCharacterSpecGearSummary(character);
  const detailsTooltip = formatCharacterDetailsTooltip(character);

  return (
    <TableCell key={character.id} align="center" sx={CHARACTER_HEADER_CELL_SX}>
      <Stack spacing={0.5} sx={{ alignItems: "center", minWidth: 0, width: "100%" }}>
        <Tooltip title={detailsTooltip}>
          <TableSortLabel
            active={isActiveSort}
            direction={isActiveSort ? sortDirection : "asc"}
            onClick={onSort}
            sx={{ "& .MuiTableSortLabel-icon": { marginLeft: "2px" } }}
          >
            <Stack
              direction="row"
              spacing={0.5}
              sx={{
                alignItems: "center",
                justifyContent: "center",
                minWidth: 0,
                maxWidth: "100%",
              }}
            >
              {character.class ? (
                <Box
                  component="img"
                  src={character.class.icon}
                  alt=""
                  width={18}
                  height={18}
                  sx={{ borderRadius: "4px", flexShrink: 0 }}
                />
              ) : null}
              <Typography
                variant="caption"
                sx={{
                  ...characterNameDisplaySx(character.class),
                  minWidth: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {character.name}
              </Typography>
            </Stack>
          </TableSortLabel>
        </Tooltip>

        {specGearSummary ? (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              minWidth: 0,
              maxWidth: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              lineHeight: 1.2,
            }}
          >
            {specGearSummary}
          </Typography>
        ) : null}

        <CompletionCountChip completed={completedCount} total={dungeonCount} />

        <Stack
          direction="row"
          spacing={0.5}
          sx={{ flexWrap: "wrap", justifyContent: "center" }}
        >
          <Tooltip title={`Edit details for ${character.name}`}>
            <IconButton
              size="small"
              color="default"
              onClick={() => {
                onEditCharacter(character.id);
              }}
              aria-label={`Edit details for ${character.name}`}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={`Reset toggles for ${character.name}`}>
            <IconButton
              size="small"
              color="default"
              onClick={() => {
                onResetCharacterToggles(character.id);
              }}
              aria-label={`Reset toggles for ${character.name}`}
            >
              <RestartAltIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={`Remove character ${character.name}`}>
            <IconButton
              size="small"
              color="error"
              onClick={() => {
                onDeleteCharacter(character.id);
              }}
              aria-label={`Remove character ${character.name}`}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </TableCell>
  );
}
