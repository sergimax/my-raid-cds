import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { specsForClass } from "../../data/class-specs.ts";
import { GearSlotNames } from "../../data/gear-slot-names.ts";
import type { AppLocale } from "../../i18n/types.ts";
import { useTranslation } from "../../i18n/use-translation.ts";
import {
  getLocalizedClassName,
  getLocalizedGearSlotLabel,
  getLocalizedSpecName,
} from "../../i18n/localized-domain.ts";
import { useBisListsContext } from "../../hooks/use-bis-lists-context.ts";
import { Classes, ClassName, type ClassName as ClassNameType } from "../../types/characters.ts";
import type { BisListPreset, BisListSlot } from "../../types/bis-lists.ts";
import {
  confirmBisSlotItemsText,
  confirmedSlotDraftsToPresetSlots,
  formatBisSlotItems,
  hasBuiltInBisForSpec,
  isLocalBisPreset,
  validateBisSlotItemsText,
} from "../../utils/bis-lists.ts";
import type { CharacterEquipContext } from "../../utils/item-equip-restrictions.ts";
import { hideExternalWowTooltips } from "../../utils/hide-external-wow-tooltips.ts";
import { ClassOptionLabel } from "../class-option-label/index.tsx";
import { FormErrorMessage } from "../form-error-message/index.tsx";
import { SpecOptionLabel } from "../spec-option-label/index.tsx";
import { WowItemAlternatives } from "../wow-item-link/index.tsx";

type SlotDraft = {
  slot: number;
  itemsText: string;
  confirmedText: string;
  itemIds: number[];
};

const slotRowSx = {
  display: "grid",
  gridTemplateColumns: "6.25rem minmax(0, 1fr) auto",
  columnGap: 1,
  alignItems: "start",
  py: 0.375,
  minHeight: 32,
} as const;

const bisClassSpecSelectSx = {
  "& .MuiSelect-select": {
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    pr: "2rem !important",
  },
} as const;

function isSlotDraftDirty(slotDraft: SlotDraft): boolean {
  return slotDraft.itemsText.trim() !== slotDraft.confirmedText.trim();
}

function isSlotEditing(
  slotDraft: SlotDraft,
  editingSlots: Readonly<Record<number, boolean>>,
  isBuiltInPresetSelected: boolean,
): boolean {
  if (isBuiltInPresetSelected) {
    return false;
  }
  if (isSlotDraftDirty(slotDraft)) {
    return true;
  }
  return editingSlots[slotDraft.slot] === true;
}

const slotViewContentSx = {
  display: "flex",
  alignItems: "center",
  minHeight: 40,
  py: 0.5,
  fontSize: "0.8125rem",
  lineHeight: 1.35,
} as const;

function presetToSlotDrafts(preset: BisListPreset): SlotDraft[] {
  return preset.slots
    .slice()
    .sort((leftSlot, rightSlot) => leftSlot.slot - rightSlot.slot)
    .map((slotEntry) => {
      const itemsText = formatBisSlotItems(slotEntry.itemIds);
      return {
        slot: slotEntry.slot,
        itemsText,
        confirmedText: itemsText,
        itemIds: [...slotEntry.itemIds],
      };
    });
}

function createEmptySlotDrafts(): SlotDraft[] {
  return GearSlotNames.map((_, slot) => ({
    slot,
    itemsText: "",
    confirmedText: "",
    itemIds: [],
  }));
}

function slotDraftsToPresetSlots(
  slotDrafts: SlotDraft[],
  locale: AppLocale,
  equipContext: CharacterEquipContext,
): {
  slots: BisListSlot[];
  error: string;
} {
  const slots: BisListSlot[] = [];
  const errors: string[] = [];

  for (const slotDraft of slotDrafts) {
    const validated = validateBisSlotItemsText(
      slotDraft.slot,
      slotDraft.itemsText,
      "strict",
      equipContext,
    );
    if (validated.error) {
      errors.push(
        `${getLocalizedGearSlotLabel(slotDraft.slot, locale)}: ${validated.error}`,
      );
      continue;
    }
    if (validated.itemIds.length > 0) {
      slots.push({ slot: slotDraft.slot, itemIds: validated.itemIds });
    }
  }

  if (errors.length > 0) {
    return {
      slots: [],
      error: errors.join("; "),
    };
  }

  return { slots, error: "" };
}

function collectSlotValidationErrors(
  slotDrafts: SlotDraft[],
  mode: "partial" | "strict",
  equipContext: CharacterEquipContext,
): Record<number, string> {
  const errors: Record<number, string> = {};

  for (const slotDraft of slotDrafts) {
    const validated = validateBisSlotItemsText(
      slotDraft.slot,
      slotDraft.itemsText,
      mode,
      equipContext,
    );
    if (validated.error) {
      errors[slotDraft.slot] = validated.error;
    }
  }

  return errors;
}

type BisSlotRowProps = {
  slotDraft: SlotDraft;
  validationError?: string;
  isEditing: boolean;
  readOnly: boolean;
  equipContext: CharacterEquipContext;
  onItemsTextChange: (nextValue: string) => void;
  onItemsTextBlur: (itemsText: string) => void;
  onConfirm: () => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
};

function BisSlotRow({
  slotDraft,
  validationError,
  isEditing,
  readOnly,
  equipContext,
  onItemsTextChange,
  onItemsTextBlur,
  onConfirm,
  onStartEdit,
  onCancelEdit,
}: BisSlotRowProps) {
  const { t, locale } = useTranslation();
  const slotLabel = getLocalizedGearSlotLabel(slotDraft.slot, locale);
  const inputRef = useRef<HTMLInputElement>(null);
  const canConfirm =
    isEditing &&
    !validationError &&
    validateBisSlotItemsText(slotDraft.slot, slotDraft.itemsText, "strict", equipContext)
      .error === undefined &&
    isSlotDraftDirty(slotDraft);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  return (
    <Box
      sx={{
        ...slotRowSx,
        gridTemplateColumns: readOnly
          ? "6.25rem minmax(0, 1fr)"
          : slotRowSx.gridTemplateColumns,
      }}
    >
      <Typography
        variant="caption"
        component="span"
        sx={{
          fontWeight: 600,
          color: "text.secondary",
          lineHeight: 1.3,
          pt: isEditing ? 0.75 : 0,
          alignSelf: isEditing ? "start" : "center",
        }}
      >
        {slotLabel}
      </Typography>

      {isEditing ? (
        <TextField
          inputRef={inputRef}
          size="small"
          fullWidth
          value={slotDraft.itemsText}
          onChange={(event) => onItemsTextChange(event.target.value)}
          onBlur={(event) => onItemsTextBlur(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && canConfirm) {
              event.preventDefault();
              onConfirm();
            }
            if (event.key === "Escape") {
              event.preventDefault();
              onCancelEdit();
            }
          }}
          placeholder={t("bisPanel.itemSearchPlaceholder")}
          error={Boolean(validationError)}
          helperText={validationError ?? t("bisPanel.confirmHelper")}
          slotProps={{
            input: {
              sx: { py: 0.75, fontSize: "0.8125rem" },
            },
            formHelperText: {
              sx: { mx: 0, mt: 0.25, lineHeight: 1.3 },
            },
          }}
        />
      ) : (
        <Typography
          variant="body2"
          color="text.secondary"
          component="div"
          sx={slotViewContentSx}
        >
          <WowItemAlternatives itemIds={slotDraft.itemIds} />
        </Typography>
      )}

      {isEditing ? (
        <Stack direction="row" spacing={0.25} sx={{ mt: 0.25, alignSelf: "start" }}>
          <Tooltip title={t("bisPanel.cancelEditing")}>
            <IconButton
              size="small"
              aria-label={t("bisPanel.cancelEditingAria", { slot: slotLabel })}
              onClick={onCancelEdit}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("bisPanel.confirmItem")}>
            <span>
              <IconButton
                size="small"
                aria-label={t("bisPanel.confirmItemAria", { slot: slotLabel })}
                onClick={onConfirm}
                disabled={!canConfirm}
                color="primary"
              >
                <CheckIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      ) : (
        readOnly ? null : (
          <Tooltip title={t("bisPanel.editSlot")}>
            <IconButton
              size="small"
              aria-label={t("bisPanel.editSlotAria", { slot: slotLabel })}
              onClick={onStartEdit}
              sx={{ alignSelf: "center" }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      )}
    </Box>
  );
}

export function BisListsPanel() {
  const { t, locale } = useTranslation();
  const bisLists = useBisListsContext();
  const [className, setClassName] = useState<ClassNameType>(ClassName.DeathKnight);
  const [spec, setSpec] = useState("Unholy");
  const [slotDrafts, setSlotDrafts] = useState<SlotDraft[]>([]);
  const [slotErrors, setSlotErrors] = useState<Record<number, string>>({});
  const [editingSlots, setEditingSlots] = useState<Record<number, boolean>>({});
  const [saveListName, setSaveListName] = useState("");
  const [error, setError] = useState("");

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
  const [trackedEditorSessionKey, setTrackedEditorSessionKey] =
    useState(editorSessionKey);

  const equipContext = useMemo<CharacterEquipContext>(
    () => ({ className, spec: activeSpec }),
    [activeSpec, className],
  );

  if (editorSessionKey !== trackedEditorSessionKey) {
    setTrackedEditorSessionKey(editorSessionKey);
    const nextDrafts = selectedPreset
      ? presetToSlotDrafts(selectedPreset)
      : createEmptySlotDrafts();
    setSlotDrafts(nextDrafts);
    setSlotErrors(collectSlotValidationErrors(nextDrafts, "strict", equipContext));
    setEditingSlots({});
    setSaveListName(
      selectedPreset && isLocalBisPreset(selectedPreset) ? selectedPreset.name : "",
    );
    setError("");
  }

  const handleSelectPreset = useCallback(
    (presetId: string) => {
      bisLists.selectPreset(className, activeSpec, presetId);
      setError("");
    },
    [activeSpec, bisLists, className],
  );

  const hasSlotErrors = Object.keys(slotErrors).length > 0;
  const hasUnconfirmedSlots = slotDrafts.some(isSlotDraftDirty);

  const updateSlotValidation = useCallback((slot: number, itemsText: string, mode: "partial" | "strict") => {
    const validated = validateBisSlotItemsText(slot, itemsText, mode, equipContext);
    setSlotErrors((previousErrors) => {
      if (validated.error) {
        return { ...previousErrors, [slot]: validated.error };
      }
      if (!(slot in previousErrors)) {
        return previousErrors;
      }
      const nextErrors = { ...previousErrors };
      delete nextErrors[slot];
      return nextErrors;
    });
  }, [equipContext]);

  const handleConfirmSlot = useCallback(
    (slotIndex: number) => {
      const slotDraft = slotDrafts[slotIndex];
      if (!slotDraft) {
        return;
      }

      const confirmed = confirmBisSlotItemsText(
        slotDraft.slot,
        slotDraft.itemsText,
        equipContext,
      );
      if (!confirmed.ok) {
        setSlotErrors((previousErrors) => ({
          ...previousErrors,
          [slotDraft.slot]: confirmed.error,
        }));
        return;
      }

      const nextDrafts = slotDrafts.map((entry, entryIndex) =>
        entryIndex === slotIndex
          ? {
              ...entry,
              itemsText: confirmed.itemsText,
              confirmedText: confirmed.itemsText,
              itemIds: confirmed.itemIds,
            }
          : entry,
      );

      setSlotDrafts(nextDrafts);
      setSlotErrors((previousErrors) => {
        if (!(slotDraft.slot in previousErrors)) {
          return previousErrors;
        }
        const nextErrors = { ...previousErrors };
        delete nextErrors[slotDraft.slot];
        return nextErrors;
      });
      setEditingSlots((previousEditing) => {
        if (!(slotDraft.slot in previousEditing)) {
          return previousEditing;
        }
        const nextEditing = { ...previousEditing };
        delete nextEditing[slotDraft.slot];
        return nextEditing;
      });
      setError("");

      if (selectedPreset && isLocalBisPreset(selectedPreset)) {
        bisLists.updateSelectedLocalPresetSlots(
          className,
          activeSpec,
          confirmedSlotDraftsToPresetSlots(nextDrafts),
        );
      }
    },
    [activeSpec, bisLists, className, equipContext, selectedPreset, slotDrafts],
  );

  const handleStartEditSlot = useCallback(
    (slot: number) => {
      if (isBuiltInPresetSelected) {
        return;
      }
      setEditingSlots((previousEditing) => ({ ...previousEditing, [slot]: true }));
      setError("");
    },
    [isBuiltInPresetSelected],
  );

  const handleCancelEditSlot = useCallback((slotIndex: number) => {
    setSlotDrafts((previousDrafts) => {
      const slotDraft = previousDrafts[slotIndex];
      if (!slotDraft) {
        return previousDrafts;
      }

      setEditingSlots((previousEditing) => {
        if (!(slotDraft.slot in previousEditing)) {
          return previousEditing;
        }
        const nextEditing = { ...previousEditing };
        delete nextEditing[slotDraft.slot];
        return nextEditing;
      });
      setSlotErrors((previousErrors) => {
        if (!(slotDraft.slot in previousErrors)) {
          return previousErrors;
        }
        const nextErrors = { ...previousErrors };
        delete nextErrors[slotDraft.slot];
        return nextErrors;
      });

      return previousDrafts.map((entry, entryIndex) =>
        entryIndex === slotIndex
          ? { ...entry, itemsText: entry.confirmedText }
          : entry,
      );
    });
  }, []);

  const handleSaveList = useCallback(() => {
    if (hasUnconfirmedSlots) {
      setError(t("bisPanel.confirmAllSlots"));
      return;
    }

    const strictErrors = collectSlotValidationErrors(slotDrafts, "strict", equipContext);
    if (Object.keys(strictErrors).length > 0) {
      setSlotErrors(strictErrors);
      setError(t("bisPanel.fixItemErrors"));
      return;
    }

    const parsed = slotDraftsToPresetSlots(slotDrafts, locale, equipContext);
    if (parsed.error) {
      setError(parsed.error);
      return;
    }

    const result = bisLists.savePresetByName(
      className,
      activeSpec,
      saveListName,
      parsed.slots,
    );
    if (!result.ok) {
      setError(result.error);
      return;
    }

    setError("");
  }, [activeSpec, bisLists, className, equipContext, hasUnconfirmedSlots, locale, saveListName, slotDrafts, t]);

  const handleDeleteLocalPreset = useCallback(
    (presetId: string) => {
      bisLists.deleteLocalPreset(className, activeSpec, presetId);
      setError("");
    },
    [activeSpec, bisLists, className],
  );

  useEffect(() => () => hideExternalWowTooltips(), []);

  const saveListForm = (
    <Stack spacing={1}>
      <TextField
        size="small"
        label={t("bisPanel.listName")}
        value={saveListName}
        onChange={(event) => {
          setSaveListName(event.target.value);
          setError("");
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
          maxHeight: { xs: 360, md: 480 },
          overflowY: "auto",
          pr: 0.5,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          columnGap: 2,
          rowGap: 0,
          alignContent: "start",
        }}
      >
        {slotDrafts.map((slotDraft, index) => (
          <BisSlotRow
            key={slotDraft.slot}
            slotDraft={slotDraft}
            validationError={slotErrors[slotDraft.slot]}
            isEditing={isSlotEditing(slotDraft, editingSlots, isBuiltInPresetSelected)}
            readOnly={isBuiltInPresetSelected}
            equipContext={equipContext}
            onItemsTextChange={(nextValue) => {
              setSlotDrafts((previousDrafts) =>
                previousDrafts.map((entry, entryIndex) =>
                  entryIndex === index ? { ...entry, itemsText: nextValue } : entry,
                ),
              );
              updateSlotValidation(slotDraft.slot, nextValue, "partial");
              setError("");
            }}
            onItemsTextBlur={(itemsText) => {
              updateSlotValidation(slotDraft.slot, itemsText, "strict");
            }}
            onConfirm={() => handleConfirmSlot(index)}
            onStartEdit={() => handleStartEditSlot(slotDraft.slot)}
            onCancelEdit={() => handleCancelEditSlot(index)}
          />
        ))}
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
                  setError("");
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
                  setError("");
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
