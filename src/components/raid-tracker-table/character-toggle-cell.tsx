import { Switch, TableCell, Tooltip, Box } from "@mui/material";
import { useCallback, useMemo, useState, memo } from "react";
import type { AppLocale } from "../../i18n/types.ts";
import type { CharacterRecord, ClassName } from "../../types/characters.ts";
import type { DungeonRecord, DungeonToggles } from "../../types/dungeons.ts";
import type { BisSlotMap } from "../../utils/bis-lists.ts";
import { isCooldownOn } from "../../utils/dungeon-toggles.ts";
import { useTranslation } from "../../i18n/use-translation.ts";
import { getLocalizedDungeonDisplayName } from "../../i18n/localized-domain.ts";
import {
  evaluateCharacterGearHints,
  hasAnyGearHint,
} from "../../utils/character-gear-hints.ts";
import { getGearHintCellDisplay } from "../../utils/gear-upgrade-hint.ts";
import {
  gearUpgradeHintDualCellSx,
  gearUpgradeHintCellSx,
} from "../../utils/gear-hint-display.ts";
import { GearHintTooltipContent } from "../gear-hint-tooltip/index.tsx";
import { CHARACTER_BODY_CELL_SX } from "./table-layout.ts";

type GetBisSlotMapForSpec = (className: ClassName, spec: string) => BisSlotMap;

type CharacterToggleCellProps = {
  character: CharacterRecord;
  dungeon: DungeonRecord;
  dungeonToggles: DungeonToggles;
  onDungeonToggle: (characterId: string, dungeonId: string) => void;
  locale: AppLocale;
  getBisSlotMapForSpec: GetBisSlotMapForSpec;
};

function areCharacterToggleCellPropsEqual(
  previous: CharacterToggleCellProps,
  next: CharacterToggleCellProps,
): boolean {
  if (previous.character !== next.character) {
    return false;
  }
  if (previous.dungeon !== next.dungeon) {
    return false;
  }
  if (previous.onDungeonToggle !== next.onDungeonToggle) {
    return false;
  }
  if (previous.locale !== next.locale) {
    return false;
  }
  if (previous.getBisSlotMapForSpec !== next.getBisSlotMapForSpec) {
    return false;
  }
  const characterId = previous.character.id;
  const dungeonId = previous.dungeon.id;
  return (
    isCooldownOn(previous.dungeonToggles, characterId, dungeonId) ===
    isCooldownOn(next.dungeonToggles, characterId, dungeonId)
  );
}

export const CharacterToggleCell = memo(function CharacterToggleCell({
  character,
  dungeon,
  dungeonToggles,
  onDungeonToggle,
  locale,
  getBisSlotMapForSpec,
}: CharacterToggleCellProps) {
  const { t } = useTranslation();

  const gearHints = useMemo(
    () =>
      evaluateCharacterGearHints(
        character,
        dungeon,
        getBisSlotMapForSpec,
        locale,
      ),
    [character, dungeon, getBisSlotMapForSpec, locale],
  );

  const isDungeonMarkedComplete = isCooldownOn(
    dungeonToggles,
    character.id,
    dungeon.id,
  );

  const hasGearHints = hasAnyGearHint(gearHints);
  const dungeonDisplayName = getLocalizedDungeonDisplayName(dungeon, locale, false);

  const mainDisplay = gearHints.main
    ? getGearHintCellDisplay(gearHints.main.gearHint)
    : null;
  const offDisplay = gearHints.off
    ? getGearHintCellDisplay(gearHints.off.gearHint)
    : null;
  const hasDualSpecGear = Boolean(character.mainSpec && character.offSpec);

  const cellHintSx = useMemo(() => {
    if (isDungeonMarkedComplete) {
      return {};
    }
    if (hasDualSpecGear) {
      return gearUpgradeHintDualCellSx(mainDisplay, offDisplay, dungeon.itemLevel);
    }
    return gearUpgradeHintCellSx(mainDisplay ?? offDisplay, dungeon.itemLevel);
  }, [
    dungeon.itemLevel,
    hasDualSpecGear,
    isDungeonMarkedComplete,
    mainDisplay,
    offDisplay,
  ]);

  const [gearHintTooltipOpen, setGearHintTooltipOpen] = useState(false);

  const handleToggle = useCallback(() => {
    setGearHintTooltipOpen(false);
    onDungeonToggle(character.id, dungeon.id);
  }, [character.id, dungeon.id, onDungeonToggle]);

  const handleGearHintTooltipOpen = useCallback(() => {
    if (!isDungeonMarkedComplete) {
      setGearHintTooltipOpen(true);
    }
  }, [isDungeonMarkedComplete]);

  const handleGearHintTooltipClose = useCallback(() => {
    setGearHintTooltipOpen(false);
  }, []);

  const tooltipTitle = useMemo(
    () => (
      <GearHintTooltipContent
        gearHints={gearHints}
        characterClassName={character.class?.name}
        locale={locale}
        t={t}
      />
    ),
    [character.class?.name, gearHints, locale, t],
  );

  const toggleSwitch = (
    <Switch
      size="small"
      checked={isDungeonMarkedComplete}
      onChange={handleToggle}
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
        hasGearHints && {
          transition: (theme) =>
            theme.transitions.create(["background", "background-color"], {
              duration: theme.transitions.duration.shortest,
            }),
        },
        cellHintSx,
      ]}
    >
      <Box
        component="span"
        sx={{ position: "relative", zIndex: 1, display: "inline-flex" }}
      >
        {hasGearHints ? (
          <Tooltip
            open={!isDungeonMarkedComplete && gearHintTooltipOpen}
            onOpen={handleGearHintTooltipOpen}
            onClose={handleGearHintTooltipClose}
            disableInteractive={false}
            slotProps={{
              tooltip: {
                sx: { maxWidth: "none", p: 1 },
              },
            }}
            title={tooltipTitle}
          >
            <span>{toggleSwitch}</span>
          </Tooltip>
        ) : (
          toggleSwitch
        )}
      </Box>
    </TableCell>
  );
}, areCharacterToggleCellPropsEqual);
