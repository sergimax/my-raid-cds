import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SaveIcon from "@mui/icons-material/Save";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { specsForClass } from "../../data/class-specs.ts";
import {
  BIS_PAPER_DOLL_BOTTOM_SLOTS,
  BIS_PAPER_DOLL_LEFT_ROWS,
  BIS_PAPER_DOLL_RIGHT_ROWS,
  type BisPaperDollRow,
} from "../../data/bis-paper-doll-slots.ts";
import type { TranslateFn } from "../../i18n/translate.ts";
import { useTranslation } from "../../i18n/use-translation.ts";
import {
  getLocalizedClassName,
  getLocalizedSpecName,
} from "../../i18n/localized-domain.ts";
import { useBisListsContext } from "../../hooks/use-bis-lists-context.ts";
import { useBisListsEditorState } from "../../hooks/use-bis-lists-editor-state.ts";
import {
  BIS_LISTS_STORAGE_QUOTA_MESSAGE,
  BIS_LISTS_STORAGE_SAVE_FAILED_MESSAGE,
} from "../../storage/bis-lists/index.ts";
import { Classes, ClassName, type ClassName as ClassNameType } from "../../types/characters.ts";
import {
  hasBuiltInBisForSpec,
  isLocalBisPreset,
} from "../../utils/bis-lists.ts";
import { isSlotEditing, type BisSlotDraft } from "../../utils/bis-list-editor.ts";
import type { CharacterEquipContext } from "../../utils/item-equip-restrictions.ts";
import { hideExternalWowTooltips } from "../../utils/hide-external-wow-tooltips.ts";
import { BisSlotRow } from "../bis-slot-row/index.tsx";
import { ClassOptionLabel } from "../class-option-label/index.tsx";
import { FormErrorMessage } from "../form-error-message/index.tsx";
import { SpecOptionLabel } from "../spec-option-label/index.tsx";
import { BisCosmeticSlotRow } from "./bis-cosmetic-slot-row.tsx";

function localizeBisStorageMessage(message: string, t: TranslateFn): string {
  if (message === BIS_LISTS_STORAGE_QUOTA_MESSAGE) {
    return t("storage.quotaExceeded");
  }
  if (message === BIS_LISTS_STORAGE_SAVE_FAILED_MESSAGE) {
    return t("storage.saveFailed");
  }
  return message;
}

const bisClassSpecSelectSx = {
  "& .MuiSelect-select": {
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    pr: "2rem !important",
  },
} as const;

export function BisListsPanel() {
  const { t, locale } = useTranslation();
  const bisLists = useBisListsContext();
  const [className, setClassName] = useState<ClassNameType>(ClassName.DeathKnight);
  const [spec, setSpec] = useState("Unholy");

  const classSpecs = useMemo(() => specsForClass(className), [className]);
  const activeSpec = classSpecs.includes(spec) ? spec : (classSpecs[0] ?? "");
  const presets = useMemo(
    () => bisLists.getPresetsForSpec(className, activeSpec),
    [activeSpec, bisLists, className],
  );
  const selectedPreset = useMemo(
    () => bisLists.getSelectedPreset(className, activeSpec),
    [activeSpec, bisLists, className],
  );
  const hasBuiltIn = hasBuiltInBisForSpec(className, activeSpec);
  const isCustomListCreation = !hasBuiltIn && presets.length === 0;
  const selectedPresetId = selectedPreset?.id;
  const isBuiltInPresetSelected = Boolean(
    selectedPreset && !isLocalBisPreset(selectedPreset),
  );
  const editorSessionKey = `${className}:${activeSpec}:${selectedPresetId ?? "none"}`;

  const equipContext = useMemo<CharacterEquipContext>(
    () => ({ className, spec: activeSpec }),
    [activeSpec, className],
  );

  const editor = useBisListsEditorState({
    editorSessionKey,
    className,
    activeSpec,
    selectedPreset,
    isBuiltInPresetSelected,
    equipContext,
    bisLists,
  });
  const {
    slotDrafts,
    slotErrors,
    editingSlots,
    saveListName,
    setSaveListName,
    error,
    clearError,
    hasSlotErrors,
    hasUnconfirmedSlots,
    handleConfirmSlot,
    handleStartEditSlot,
    handleCancelEditSlot,
    handleSaveList,
    handleItemsTextChange,
    handleItemsTextBlur,
  } = editor;

  const handleSelectPreset = useCallback(
    (presetId: string) => {
      bisLists.selectPreset(className, activeSpec, presetId);
      clearError();
    },
    [activeSpec, bisLists, className, clearError],
  );

  const handleDeleteLocalPreset = useCallback(
    (presetId: string) => {
      bisLists.deleteLocalPreset(className, activeSpec, presetId);
      clearError();
    },
    [activeSpec, bisLists, className, clearError],
  );

  useEffect(() => () => hideExternalWowTooltips(), []);

  const slotDraftBySlot = useMemo(() => {
    const bySlot = new Map<number, { draft: BisSlotDraft; index: number }>();
    for (const [index, draft] of slotDrafts.entries()) {
      bySlot.set(draft.slot, { draft, index });
    }
    return bySlot;
  }, [slotDrafts]);

  const renderGearSlotRow = useCallback(
    (slot: number) => {
      const entry = slotDraftBySlot.get(slot);
      if (!entry) {
        return null;
      }
      return (
        <BisSlotRow
          key={slot}
          slotIndex={entry.index}
          slotDraft={entry.draft}
          validationError={slotErrors[entry.draft.slot]}
          isEditing={isSlotEditing(
            entry.draft,
            editingSlots,
            isBuiltInPresetSelected,
          )}
          readOnly={isBuiltInPresetSelected}
          equipContext={equipContext}
          onItemsTextChange={handleItemsTextChange}
          onItemsTextBlur={handleItemsTextBlur}
          onConfirm={handleConfirmSlot}
          onStartEdit={handleStartEditSlot}
          onCancelEdit={handleCancelEditSlot}
        />
      );
    },
    [
      editingSlots,
      equipContext,
      handleCancelEditSlot,
      handleConfirmSlot,
      handleItemsTextBlur,
      handleItemsTextChange,
      handleStartEditSlot,
      isBuiltInPresetSelected,
      slotDraftBySlot,
      slotErrors,
    ],
  );

  const renderPaperDollColumn = useCallback(
    (rows: readonly BisPaperDollRow[]) =>
      rows.map((row) =>
        row.kind === "cosmetic" ? (
          <BisCosmeticSlotRow key={row.id} cosmeticId={row.id} />
        ) : (
          renderGearSlotRow(row.slot)
        ),
      ),
    [renderGearSlotRow],
  );

  const saveListForm = (
    <Stack spacing={1}>
      <TextField
        size="small"
        label={t("bisPanel.listName")}
        value={saveListName}
        onChange={(event) => {
          setSaveListName(event.target.value);
          clearError();
        }}
        placeholder={t("bisPanel.listNamePlaceholder")}
        fullWidth
      />
      <Button
        variant="contained"
        startIcon={<SaveIcon />}
        onClick={handleSaveList}
        disabled={hasSlotErrors || hasUnconfirmedSlots}
        fullWidth
      >
        {t("bisPanel.saveList")}
      </Button>
    </Stack>
  );

  const slotEditor = slotDrafts.length === 0 ? null : (
    <>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.75 }}>
        {isBuiltInPresetSelected
          ? t("bisPanel.builtinReadOnly")
          : t("bisPanel.editHint")}
      </Typography>
      <Box
        sx={{
          maxHeight: { xs: 420, md: 560 },
          overflowY: "auto",
          pr: 0.5,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gridTemplateAreas: {
            xs: `
              "left"
              "right"
              "weapons"
            `,
            sm: `
              "left right"
              "weapons weapons"
            `,
          },
          columnGap: 2,
          rowGap: 1,
          alignContent: "start",
        }}
      >
        <Stack spacing={0} sx={{ gridArea: "left", minWidth: 0 }}>
          {renderPaperDollColumn(BIS_PAPER_DOLL_LEFT_ROWS)}
        </Stack>
        <Stack spacing={0} sx={{ gridArea: "right", minWidth: 0 }}>
          {renderPaperDollColumn(BIS_PAPER_DOLL_RIGHT_ROWS)}
        </Stack>
        <Box
          sx={{
            gridArea: "weapons",
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(3, minmax(0, 1fr))",
            },
            columnGap: 2,
            rowGap: 0,
            pt: { sm: 0.5 },
            borderTop: 1,
            borderColor: "divider",
            minWidth: 0,
          }}
        >
          {BIS_PAPER_DOLL_BOTTOM_SLOTS.map((slot) => renderGearSlotRow(slot))}
        </Box>
      </Box>
    </>
  );

  const presetsSidebar = isCustomListCreation ? (
    <Stack spacing={1.25} sx={{ minWidth: 0 }}>
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8125rem" }}>
        {t("bisPanel.createCustomListHint", {
          class: getLocalizedClassName(className, locale),
          spec: getLocalizedSpecName(className, activeSpec, locale),
        })}
      </Typography>
      {saveListForm}
      <Typography variant="caption" color="text.secondary">
        {t("bisPanel.localListsOnly")}
      </Typography>
    </Stack>
  ) : (
    <Stack spacing={1.25} sx={{ minWidth: 0 }}>
      <Stack spacing={0.75}>
        {presets.map((preset) => {
          const isSelected = preset.id === selectedPresetId;
          const isLocal = isLocalBisPreset(preset);
          const isBuiltIn = !isLocal;

          return (
            <Chip
              key={preset.id}
              icon={isBuiltIn ? <LockOutlinedIcon /> : undefined}
              label={preset.name}
              variant={isSelected ? "filled" : "outlined"}
              color={isSelected ? (isBuiltIn ? "secondary" : "primary") : "default"}
              onClick={() => handleSelectPreset(preset.id)}
              onDelete={isLocal ? () => handleDeleteLocalPreset(preset.id) : undefined}
              sx={{
                width: "100%",
                justifyContent: "flex-start",
                pl: isBuiltIn ? 0.5 : undefined,
                ...(isBuiltIn && {
                  borderStyle: isSelected ? "solid" : "dashed",
                  opacity: isSelected ? 1 : 0.88,
                }),
                "& .MuiChip-label": {
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                },
              }}
            />
          );
        })}
      </Stack>

      <Divider />

      {saveListForm}

      {!hasBuiltIn ? (
        <Typography variant="caption" color="text.secondary">
          {t("bisPanel.localListsOnly")}
        </Typography>
      ) : null}
    </Stack>
  );

  return (
    <Stack spacing={1.25}>
      {bisLists.storageError ? (
        <Alert severity="error">
          {localizeBisStorageMessage(bisLists.storageError, t)}
        </Alert>
      ) : null}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "13rem minmax(0, 1fr) 14rem",
            lg: "14.5rem minmax(0, 1fr) 16rem",
          },
          gap: { xs: 1.5, md: 2 },
          alignItems: "start",
        }}
      >
        <Stack
          spacing={1.25}
          sx={{
            pb: { xs: 0, md: 0 },
            borderRight: { md: 1 },
            borderColor: { md: "divider" },
            pr: { md: 2 },
          }}
        >
          <Typography variant="overline" sx={{ lineHeight: 1.2, color: "text.secondary" }}>
            {t("bisPanel.classAndSpec")}
          </Typography>
          <FormControl size="small" fullWidth>
            <InputLabel id="bis-class-label">{t("common.class")}</InputLabel>
            <Select
              labelId="bis-class-label"
              label={t("common.class")}
              value={className}
              sx={bisClassSpecSelectSx}
              renderValue={(selectedName) => {
                const selectedClass = Classes.find(
                  (option) => option.name === selectedName,
                );
                if (!selectedClass) {
                  return selectedName;
                }
                return <ClassOptionLabel characterClass={selectedClass} />;
              }}
              onChange={(event) => {
                const nextClass = event.target.value as ClassNameType;
                setClassName(nextClass);
                setSpec(specsForClass(nextClass)[0] ?? "");
                clearError();
              }}
            >
              {Classes.map((characterClass) => (
                <MenuItem key={characterClass.name} value={characterClass.name}>
                  <ClassOptionLabel characterClass={characterClass} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth>
            <InputLabel id="bis-spec-label">{t("common.spec")}</InputLabel>
            <Select
              labelId="bis-spec-label"
              label={t("common.spec")}
              value={activeSpec}
              sx={bisClassSpecSelectSx}
              renderValue={(selectedSpec) => (
                <SpecOptionLabel className={className} spec={selectedSpec} />
              )}
              onChange={(event) => {
                setSpec(event.target.value);
                clearError();
              }}
            >
              {classSpecs.map((specName) => (
                <MenuItem key={specName} value={specName}>
                  <SpecOptionLabel className={className} spec={specName} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <Box
          sx={{
            minWidth: 0,
            borderRight: { md: 1 },
            borderColor: { md: "divider" },
            pr: { md: 2 },
          }}
        >
          <Typography
            variant="overline"
            sx={{ lineHeight: 1.2, color: "text.secondary", display: "block", mb: 1 }}
          >
            {t("bisPanel.items")}
          </Typography>
          {slotEditor}
        </Box>

        <Stack spacing={1} sx={{ minWidth: 0 }}>
          <Typography variant="overline" sx={{ lineHeight: 1.2, color: "text.secondary" }}>
            {t("bisPanel.lists")}
          </Typography>
          {presetsSidebar}
        </Stack>
      </Box>

      {error ? <FormErrorMessage message={error} /> : null}
    </Stack>
  );
}
