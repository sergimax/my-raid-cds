import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import type { ItemTooltipLocale } from "../../constants/item-tooltips.ts";
import type { TranslateFn } from "../../i18n/translate.ts";
import type { CharacterClass } from "../../types/characters.ts";
import type { CharacterGearItem } from "../../types/character-gear.ts";
import {
  formatGearSummary,
  sortGearItemsBySlot,
} from "../../utils/format-stored-gear.ts";
import { summarizeGearItemLevels } from "../../utils/summarize-gear-item-levels.ts";
import { parseWowSimsExporterJson } from "../../utils/parse-wowsims-exporter.ts";
import { SpecOptionLabel } from "../spec-option-label/index.tsx";
import { StoredGearItemLine } from "../stored-gear-item-line/index.tsx";

type CharacterSpecGearImportSectionProps = {
  label: string;
  spec?: string;
  characterClass: CharacterClass;
  gearItems: CharacterGearItem[] | undefined;
  onGearItemsChange: (gearItems: CharacterGearItem[] | undefined) => void;
  onError: (message: string) => void;
  onClearError: () => void;
  locale: ItemTooltipLocale;
  t: TranslateFn;
};

export function CharacterSpecGearImportSection({
  label,
  spec,
  characterClass,
  gearItems,
  onGearItemsChange,
  onError,
  onClearError,
  locale,
  t,
}: CharacterSpecGearImportSectionProps) {
  const [wowsimsImportText, setWowsimsImportText] = useState("");
  const [importNotice, setImportNotice] = useState("");

  const storedGearSummary = useMemo(() => {
    if (!gearItems || gearItems.length === 0) {
      return null;
    }
    return summarizeGearItemLevels(gearItems);
  }, [gearItems]);

  const sortedGearItems = useMemo(
    () => (gearItems ? sortGearItemsBySlot(gearItems) : []),
    [gearItems],
  );

  const handleImportGear = useCallback(() => {
    onClearError();
    setImportNotice("");

    const result = parseWowSimsExporterJson(
      wowsimsImportText,
      characterClass.name,
      locale,
    );
    if (!result.ok) {
      onError(result.error);
      return;
    }

    onGearItemsChange(result.gearItems);

    const noticeParts = [
      t("characterEdit.importedSummary", {
        summary: formatGearSummary(result.gearItems, locale),
      }),
    ];
    if (result.exportSpec) {
      noticeParts.push(
        t("characterEdit.importedSpec", { spec: result.exportSpec }),
      );
    }
    if (result.warnings.length > 0) {
      noticeParts.push(result.warnings.join(" "));
    }
    setImportNotice(noticeParts.join(" "));
    setWowsimsImportText("");
  }, [
    characterClass.name,
    locale,
    onClearError,
    onError,
    onGearItemsChange,
    t,
    wowsimsImportText,
  ]);

  return (
    <Stack spacing={1}>
      {spec ? (
        <SpecOptionLabel
          className={characterClass.name}
          spec={spec}
          variant="body2"
          iconSize={20}
        />
      ) : (
        <Typography variant="subtitle2">{label}</Typography>
      )}
      {storedGearSummary ? (
        <Stack spacing={0.5}>
          <Typography variant="body2">
            {t("characterEdit.storedGear")}
            {storedGearSummary.averageItemLevel !== undefined
              ? t("characterEdit.avgIlvl", {
                  ilvl: storedGearSummary.averageItemLevel,
                })
              : ""}
          </Typography>
          <Box
            component="ul"
            sx={{ m: 0, pl: 2.5, maxHeight: 160, overflowY: "auto" }}
          >
            {sortedGearItems.map((item) => (
              <Typography
                key={`${item.slot}-${item.id}`}
                component="li"
                variant="body2"
              >
                <StoredGearItemLine item={item} />
              </Typography>
            ))}
          </Box>
          {storedGearSummary.unknownItemIds.length > 0 ? (
            <Typography variant="caption" color="warning.main">
              {t("characterEdit.unknownItemIds", {
                count: storedGearSummary.unknownItemIds.length,
              })}
            </Typography>
          ) : null}
        </Stack>
      ) : null}
      <TextField
        label={t("characterEdit.wseJson")}
        value={wowsimsImportText}
        onChange={(event) => {
          setWowsimsImportText(event.target.value);
          onClearError();
          setImportNotice("");
        }}
        multiline
        minRows={3}
        maxRows={8}
        placeholder={t("characterEdit.wsePlaceholder")}
        helperText={t("characterEdit.wseHelper")}
        fullWidth
      />
      <Box>
        <Button
          type="button"
          variant="outlined"
          onClick={handleImportGear}
          disabled={wowsimsImportText.trim() === ""}
        >
          {t("characterEdit.importButton")}
        </Button>
      </Box>
      {importNotice ? (
        <Typography variant="body2" color="success.main">
          {importNotice}
        </Typography>
      ) : null}
    </Stack>
  );
}
