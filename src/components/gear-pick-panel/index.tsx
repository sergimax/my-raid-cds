import { Box, Stack, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { getWotlkItemName } from "../../data/wotlk-item-names.ts";
import { useBisListsContext } from "../../hooks/use-bis-lists-context.ts";
import { useItemTooltipLocale } from "../../hooks/use-item-tooltip-locale.ts";
import { getLocalizedSpecName } from "../../i18n/localized-domain.ts";
import { useTranslation } from "../../i18n/use-translation.ts";
import type { CharacterRecord } from "../../types/characters.ts";
import type { DungeonRecord } from "../../types/dungeons.ts";
import { buildGearPickItems } from "../../utils/build-gear-pick-items.ts";
import {
  clampAssignmentsToMaxSofts,
  DEFAULT_SOFT_ROLL_RULES,
  formatGearPickCopyText,
  remainingSoftBudget,
  setMySoftsForItem,
  setOthersCountForWeight,
  sumMySofts,
  type SoftAssignmentByItemId,
  type SoftRollRules,
} from "../../utils/gear-pick-soft-roll.ts";
import { ExportDungeonFilter } from "../export-panel/export-dungeon-filter.tsx";
import { ExportFilterSection } from "../export-panel/export-filter-section.tsx";
import {
  GEAR_PICK_FILTER_COLUMN_MAX_WIDTH,
  GEAR_PICK_ITEMS_MAX_HEIGHT,
  GEAR_PICK_SIDE_BY_SIDE_MQ_KEY,
} from "./constants.ts";
import {
  GearPickCharacterSelect,
  type GearPickCharacterSelection,
} from "./gear-pick-character-select.tsx";
import { GearPickCopyBlock } from "./gear-pick-copy-block.tsx";
import { GearPickItemRow } from "./gear-pick-item-row.tsx";
import { GearPickRules } from "./gear-pick-rules.tsx";
import { useGearPickPanelSideBySide } from "./use-gear-pick-panel-side-by-side.ts";

export type GearPickPanelProps = {
  characters: readonly CharacterRecord[];
  visibleDungeons: readonly DungeonRecord[];
  dungeonNameSearch: string;
  totalDungeonCount: number;
};

export function GearPickPanel({
  characters,
  visibleDungeons,
  dungeonNameSearch,
  totalDungeonCount,
}: GearPickPanelProps) {
  const { t, locale } = useTranslation();
  const { locale: itemLocale } = useItemTooltipLocale();
  const { getBisSlotMapForSpec } = useBisListsContext();
  const sideBySide = useGearPickPanelSideBySide();

  const [selection, setSelection] = useState<GearPickCharacterSelection | null>(
    null,
  );
  const [rules, setRules] = useState<SoftRollRules>(DEFAULT_SOFT_ROLL_RULES);
  const [assignmentsByItemId, setAssignmentsByItemId] =
    useState<SoftAssignmentByItemId>({});

  const handleSelectionChange = (next: GearPickCharacterSelection) => {
    setSelection(next);
    setAssignmentsByItemId({});
  };

  const selectedCharacter = useMemo(
    () =>
      selection
        ? characters.find((character) => character.id === selection.characterId)
        : undefined,
    [characters, selection],
  );

  const selectedSpecGear =
    selection && selectedCharacter
      ? selection.side === "main"
        ? selectedCharacter.mainSpec
        : selectedCharacter.offSpec
      : undefined;

  const gearPickItems = useMemo(() => {
    if (!selectedCharacter || !selection || !selectedSpecGear) {
      return [];
    }
    return buildGearPickItems({
      character: selectedCharacter,
      specSide: selection.side,
      dungeons: visibleDungeons,
      getBisSlotMapForSpec,
      locale,
    });
  }, [
    getBisSlotMapForSpec,
    locale,
    selectedCharacter,
    selectedSpecGear,
    selection,
    visibleDungeons,
  ]);

  const softBudgetUsed = sumMySofts(assignmentsByItemId);

  const emptyItemsMessage = useMemo(() => {
    if (!selection || !selectedCharacter) {
      return t("gearPickPanel.itemsEmptyNoSelection");
    }
    if (!selectedSpecGear) {
      return t("gearPickPanel.itemsEmptyNoSelection");
    }
    if (!selectedSpecGear.gearItems || selectedSpecGear.gearItems.length === 0) {
      return t("gearPickPanel.itemsEmptyNoGear");
    }
    const className = selectedCharacter.class?.name;
    if (!className) {
      return t("gearPickPanel.itemsEmptyNoSelection");
    }
    const bisMap = getBisSlotMapForSpec(className, selectedSpecGear.spec);
    if (bisMap.size === 0) {
      return t("gearPickPanel.itemsEmptyNoBis");
    }
    if (gearPickItems.length === 0) {
      return t("gearPickPanel.itemsEmptyNoItems");
    }
    return null;
  }, [
    gearPickItems.length,
    getBisSlotMapForSpec,
    selectedCharacter,
    selectedSpecGear,
    selection,
    t,
  ]);

  const copyItems = useMemo(() => {
    return gearPickItems
      .map((item) => {
        const mySofts = assignmentsByItemId[item.itemId]?.mySofts ?? 0;
        if (mySofts <= 0) {
          return null;
        }
        return {
          itemName:
            getWotlkItemName(item.itemId, itemLocale) ?? `#${item.itemId}`,
          bossName: item.bossName,
          mySofts,
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null);
  }, [assignmentsByItemId, gearPickItems, itemLocale]);

  const copyText = useMemo(() => {
    if (!selectedCharacter || !selectedSpecGear || !selectedCharacter.class) {
      return "";
    }
    return formatGearPickCopyText({
      characterName: selectedCharacter.name,
      specLabel: getLocalizedSpecName(
        selectedCharacter.class.name,
        selectedSpecGear.spec,
        locale,
        true,
      ),
      system: rules.system,
      maxSofts: rules.maxSofts,
      systemLabel:
        rules.system === "plus100"
          ? t("gearPickPanel.systemLabelPlus100")
          : t("gearPickPanel.systemLabelReroll"),
      items: copyItems,
    });
  }, [
    copyItems,
    locale,
    rules.maxSofts,
    rules.system,
    selectedCharacter,
    selectedSpecGear,
    t,
  ]);

  const handleRulesChange = (next: SoftRollRules) => {
    setRules(next);
    if (next.maxSofts !== rules.maxSofts) {
      setAssignmentsByItemId((previous) =>
        clampAssignmentsToMaxSofts(previous, next.maxSofts),
      );
    }
  };

  const filtersColumn = (
    <Stack spacing={1.5} sx={{ minWidth: 0, width: "100%" }}>
      <ExportFilterSection
        title={t("gearPickPanel.rulesTitle")}
        description={t("gearPickPanel.rulesHelper")}
      >
        <GearPickRules
          rules={rules}
          onRulesChange={handleRulesChange}
          softBudgetUsed={softBudgetUsed}
          t={t}
        />
      </ExportFilterSection>

      <ExportFilterSection
        title={t("gearPickPanel.characterTitle")}
        description={t("gearPickPanel.characterHelper")}
      >
        <GearPickCharacterSelect
          characters={characters}
          selection={selection}
          onSelectionChange={handleSelectionChange}
          t={t}
        />
      </ExportFilterSection>

      <ExportFilterSection
        title={t("gearPickPanel.dungeonFilterTitle")}
        description={t("gearPickPanel.dungeonFilterHelper")}
      >
        <ExportDungeonFilter
          dungeonNameSearch={dungeonNameSearch}
          visibleDungeons={visibleDungeons}
          totalDungeonCount={totalDungeonCount}
          locale={locale}
          t={t}
        />
      </ExportFilterSection>
    </Stack>
  );

  const itemsColumn = (
    <Stack spacing={1.5} sx={{ minWidth: 0, width: "100%", minHeight: 0 }}>
      <ExportFilterSection
        title={t("gearPickPanel.itemsTitle")}
        description={t("gearPickPanel.itemsHelper")}
        contentSx={{
          maxHeight: sideBySide ? GEAR_PICK_ITEMS_MAX_HEIGHT : undefined,
          overflowY: "auto",
        }}
      >
        {emptyItemsMessage ? (
          <Typography variant="body2" color="text.secondary">
            {emptyItemsMessage}
          </Typography>
        ) : (
          <Stack spacing={1}>
            {gearPickItems.map((item) => {
              const assignment = assignmentsByItemId[item.itemId] ?? {
                mySofts: 0,
                othersByWeight: {},
              };
              const itemLabel =
                getWotlkItemName(item.itemId, itemLocale) ?? `#${item.itemId}`;
              const budgetForItem = remainingSoftBudget(
                assignmentsByItemId,
                rules.maxSofts,
                item.itemId,
              );

              return (
                <GearPickItemRow
                  key={item.itemId}
                  item={item}
                  assignment={assignment}
                  maxSofts={rules.maxSofts}
                  system={rules.system}
                  remainingBudgetForItem={budgetForItem}
                  itemLabel={itemLabel}
                  onMySoftsChange={(mySofts) => {
                    setAssignmentsByItemId((previous) =>
                      setMySoftsForItem(
                        previous,
                        item.itemId,
                        mySofts,
                        rules.maxSofts,
                      ),
                    );
                  }}
                  onOthersCountChange={(weight, count) => {
                    setAssignmentsByItemId((previous) =>
                      setOthersCountForWeight(
                        previous,
                        item.itemId,
                        weight,
                        count,
                        rules.maxSofts,
                      ),
                    );
                  }}
                  t={t}
                />
              );
            })}
          </Stack>
        )}
      </ExportFilterSection>

      <GearPickCopyBlock
        copyText={copyText}
        hasSoftCalls={copyItems.length > 0}
        t={t}
      />
    </Stack>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        width: "100%",
        [GEAR_PICK_SIDE_BY_SIDE_MQ_KEY]: {
          flexDirection: "row",
          alignItems: "stretch",
        },
      }}
    >
      <Box
        sx={{
          minWidth: 0,
          width: "100%",
          [GEAR_PICK_SIDE_BY_SIDE_MQ_KEY]: {
            maxWidth: GEAR_PICK_FILTER_COLUMN_MAX_WIDTH,
            flex: `0 0 ${GEAR_PICK_FILTER_COLUMN_MAX_WIDTH}px`,
          },
        }}
      >
        {filtersColumn}
      </Box>
      <Box sx={{ minWidth: 0, flex: 1 }}>{itemsColumn}</Box>
    </Box>
  );
}
