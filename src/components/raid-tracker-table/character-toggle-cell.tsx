import { Switch, TableCell, Tooltip } from "@mui/material";
import { useMemo } from "react";
import type { CharacterRecord } from "../../types/characters.ts";
import type { DungeonRecord, DungeonToggles } from "../../types/dungeons.ts";
import { isCooldownOn } from "../../utils/dungeon-toggles.ts";
import { useBisListsContext } from "../../hooks/use-bis-lists-context.ts";
import { useItemTooltipLocale } from "../../hooks/use-item-tooltip-locale.ts";
import {
  evaluateGearUpgradeHint,
  formatGearUpgradeHintTooltip,
  gearUpgradeHintCellSx,
} from "../../utils/gear-upgrade-hint.ts";
import { CHARACTER_BODY_CELL_SX } from "./table-layout.ts";

type CharacterToggleCellProps = {
  character: CharacterRecord;
  dungeon: DungeonRecord;
  dungeonToggles: DungeonToggles;
  onDungeonToggle: (characterId: string, dungeonId: string) => void;
};

export function CharacterToggleCell({
  character,
  dungeon,
  dungeonToggles,
  onDungeonToggle,
}: CharacterToggleCellProps) {
  const bisLists = useBisListsContext();
  const { locale: itemTooltipLocale } = useItemTooltipLocale();
  const bisSlotMap = useMemo(
    () => bisLists.getBisSlotMapForCharacter(character),
    [bisLists, character],
  );

  const upgradeHint = useMemo(
    () => evaluateGearUpgradeHint(character.gearItems, dungeon, bisSlotMap),
    [bisSlotMap, character.gearItems, dungeon],
  );

  const tooltipTitle = formatGearUpgradeHintTooltip(upgradeHint, itemTooltipLocale);

  const toggleSwitch = (
    <Switch
      size="small"
      checked={isCooldownOn(dungeonToggles, character.id, dungeon.id)}
      onChange={() => {
        onDungeonToggle(character.id, dungeon.id);
      }}
      slotProps={{
        input: {
          "aria-label": `${character.name} — ${dungeon.name}`,
        },
      }}
    />
  );

  return (
    <TableCell
      align="center"
      sx={[
        CHARACTER_BODY_CELL_SX,
        gearUpgradeHintCellSx(upgradeHint.level, dungeon.itemLevel),
      ]}
    >
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <span>{toggleSwitch}</span>
        </Tooltip>
      ) : (
        toggleSwitch
      )}
    </TableCell>
  );
}
