import { Switch, TableCell, Tooltip } from "@mui/material";
import { useMemo } from "react";
import type { CharacterRecord } from "../../types/characters.ts";
import type { DungeonRecord, DungeonToggles } from "../../types/dungeons.ts";
import { isCooldownOn } from "../../utils/dungeon-toggles.ts";
import { useBisListsContext } from "../../hooks/use-bis-lists-context.ts";
import { useTranslation } from "../../i18n/use-translation.ts";
import { getLocalizedDungeonDisplayName } from "../../i18n/localized-domain.ts";
import {
  evaluateCharacterGearHints,
  hasAnyGearHint,
} from "../../utils/character-gear-hints.ts";
import {
  gearUpgradeHintDualCellSx,
  gearUpgradeHintCellSx,
} from "../../utils/gear-upgrade-hint.ts";
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

  const gearHints = useMemo(
    () =>
      evaluateCharacterGearHints(
        character,
        dungeon,
        bisLists.getBisSlotMapForSpec,
      ),
    [bisLists.getBisSlotMapForSpec, character, dungeon],
  );

  const showTooltip = hasAnyGearHint(gearHints);
  const dungeonDisplayName = getLocalizedDungeonDisplayName(dungeon, locale, false);

  const mainLevel = gearHints.main?.gearHint.level ?? 0;
  const offLevel = gearHints.off?.gearHint.level ?? 0;
  const hasBothSpecHints = Boolean(gearHints.main && gearHints.off);
  const cellHintSx = hasBothSpecHints
    ? gearUpgradeHintDualCellSx(mainLevel, offLevel, dungeon.itemLevel)
    : gearUpgradeHintCellSx(
        Math.max(mainLevel, offLevel),
        dungeon.itemLevel,
      );

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
      sx={[CHARACTER_BODY_CELL_SX, cellHintSx]}
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
              gearHints={gearHints}
              characterClassName={character.class?.name}
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
