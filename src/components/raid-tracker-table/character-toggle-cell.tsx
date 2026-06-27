import { Switch, TableCell, Tooltip } from "@mui/material";
import { useMemo } from "react";
import type { CharacterRecord } from "../../types/characters.ts";
import type { DungeonRecord, DungeonToggles } from "../../types/dungeons.ts";
import { isCooldownOn } from "../../utils/dungeon-toggles.ts";
import { useBisListsContext } from "../../hooks/use-bis-lists-context.ts";
import { useTranslation } from "../../i18n/use-translation.ts";
import { getLocalizedDungeonDisplayName } from "../../i18n/localized-domain.ts";
import {
  evaluateGearUpgradeHint,
  formatGearUpgradeHintTooltip,
  gearUpgradeHintCellSx,
} from "../../utils/gear-upgrade-hint.ts";
import {
  evaluateTierSetHint,
  hasTierSetTokenHint,
} from "../../utils/tier-set-hint.ts";
import { GearHintTooltipContent } from "../gear-hint-tooltip/index.tsx";
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
  const { locale, t } = useTranslation();
  const bisSlotMap = useMemo(
    () => bisLists.getBisSlotMapForCharacter(character),
    [bisLists, character],
  );

  const upgradeHint = useMemo(
    () =>
      evaluateGearUpgradeHint(character.gearItems, dungeon, bisSlotMap, {
        className: character.class?.name,
        spec: character.mainSpec?.spec,
      }),
    [bisSlotMap, character.class?.name, character.gearItems, character.mainSpec?.spec, dungeon],
  );

  const tierSetHint = useMemo(
    () => evaluateTierSetHint(character.gearItems, dungeon, bisSlotMap),
    [bisSlotMap, character.gearItems, dungeon],
  );

  const gearSummary = formatGearUpgradeHintTooltip(upgradeHint, locale, t);
  const showTooltip = Boolean(gearSummary) || hasTierSetTokenHint(tierSetHint);
  const dungeonDisplayName = getLocalizedDungeonDisplayName(dungeon, locale, false);

  const toggleSwitch = (
    <Switch
      size="small"
      checked={isCooldownOn(dungeonToggles, character.id, dungeon.id)}
      onChange={() => {
        onDungeonToggle(character.id, dungeon.id);
      }}
      slotProps={{
        input: {
          "aria-label": t("table.toggleAria", {
            character: character.name,
            dungeon: dungeonDisplayName,
          }),
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
      {showTooltip ? (
        <Tooltip
          disableInteractive={false}
          slotProps={{
            tooltip: {
              sx: { maxWidth: "none", p: 1 },
            },
          }}
          title={
            <GearHintTooltipContent
              gearHint={upgradeHint}
              tierSetHint={tierSetHint}
              locale={locale}
              t={t}
            />
          }
        >
          <span>{toggleSwitch}</span>
        </Tooltip>
      ) : (
        toggleSwitch
      )}
    </TableCell>
  );
}
