import DeleteIcon from "@mui/icons-material/Delete";
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
import { characterNameDisplaySx, type CharacterRecord } from "../../types/characters.ts";
import type { DungeonRecord, DungeonToggles } from "../../types/dungeons.ts";
import { countCompletedForCharacter } from "../../utils/completion-counts.ts";
import type { SortDirection } from "../../utils/sort-dungeons.ts";
import { CHARACTER_HEADER_CELL_SX } from "./table-layout.ts";

type CharacterHeaderCellProps = {
  character: CharacterRecord;
  dungeonCount: number;
  dungeons: DungeonRecord[];
  dungeonToggles: DungeonToggles;
  isActiveSort: boolean;
  sortDirection: SortDirection;
  onSort: () => void;
  onResetCharacterToggles: (characterId: string) => void;
  onDeleteCharacter: (characterId: string) => void;
};

export function CharacterHeaderCell({
  character,
  dungeonCount,
  dungeons,
  dungeonToggles,
  isActiveSort,
  sortDirection,
  onSort,
  onResetCharacterToggles,
  onDeleteCharacter,
}: CharacterHeaderCellProps) {
  return (
    <TableCell key={character.id} align="center" sx={CHARACTER_HEADER_CELL_SX}>
      <Stack spacing={0.5} sx={{ alignItems: "center" }}>
        <TableSortLabel
          active={isActiveSort}
          direction={isActiveSort ? sortDirection : "asc"}
          onClick={onSort}
          sx={{ "& .MuiTableSortLabel-icon": { marginLeft: "2px" } }}
        >
          <Stack
            direction="row"
            spacing={0.5}
            sx={{ alignItems: "center", justifyContent: "center" }}
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
            <Typography variant="caption" sx={characterNameDisplaySx(character.class)}>
              {character.name}
            </Typography>
          </Stack>
        </TableSortLabel>

        <Typography variant="caption" color="text.secondary">
          {countCompletedForCharacter(character.id, dungeons, dungeonToggles)}/
          {dungeonCount}
        </Typography>

        <Stack
          direction="row"
          spacing={0.5}
          sx={{ flexWrap: "wrap", justifyContent: "center" }}
        >
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
