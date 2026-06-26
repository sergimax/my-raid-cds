import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
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
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { specsForClass } from "../../data/class-specs.ts";
import { gearSlotLabel } from "../../data/gear-slot-names.ts";
import { useBisListsContext } from "../../hooks/use-bis-lists-context.ts";
import { useScrollIntoViewOnMount } from "../../hooks/use-scroll-into-view-on-mount.ts";
import { Classes, ClassName, type ClassName as ClassNameType } from "../../types/characters.ts";
import type { BisListPreset, BisListSlot } from "../../types/bis-lists.ts";
import {
  confirmBisSlotItemsText,
  formatBisSlotItems,
  hasBuiltInBisForSpec,
  isLocalBisPreset,
  validateBisSlotItemsText,
} from "../../utils/bis-lists.ts";
import { hideExternalWowTooltips } from "../../utils/hide-external-wow-tooltips.ts";
import { FormErrorMessage } from "../form-error-message/index.tsx";
import { WowItemAlternatives } from "../wow-item-link/index.tsx";

type BisListsPanelProps = {
  onClose: () => void;
};

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

function isSlotDraftDirty(slotDraft: SlotDraft): boolean {
  return slotDraft.itemsText.trim() !== slotDraft.confirmedText.trim();
}

function isSlotEditing(
  slotDraft: SlotDraft,
  editingSlots: Readonly<Record<number, boolean>>,
): boolean {
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

function slotDraftsToPresetSlots(slotDrafts: SlotDraft[]): {
  slots: BisListSlot[];
  error: string;
} {
  const slots: BisListSlot[] = [];
  const errors: string[] = [];

  for (const slotDraft of slotDrafts) {
    const validated = validateBisSlotItemsText(slotDraft.slot, slotDraft.itemsText, "strict");
    if (validated.error) {
      errors.push(`${gearSlotLabel(slotDraft.slot)}: ${validated.error}`);
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
): Record<number, string> {
  const errors: Record<number, string> = {};

  for (const slotDraft of slotDrafts) {
    const validated = validateBisSlotItemsText(slotDraft.slot, slotDraft.itemsText, mode);
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
  onItemsTextChange,
  onItemsTextBlur,
  onConfirm,
  onStartEdit,
  onCancelEdit,
}: BisSlotRowProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const canConfirm =
    isEditing &&
    !validationError &&
    validateBisSlotItemsText(slotDraft.slot, slotDraft.itemsText, "strict").error ===
      undefined &&
    isSlotDraftDirty(slotDraft);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  return (
    <Box sx={slotRowSx}>
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
        {gearSlotLabel(slotDraft.slot)}
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
          placeholder="Name, id, or #id"
          error={Boolean(validationError)}
          helperText={validationError ?? "Confirm with ✓ or cancel with ✕"}
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
          <Tooltip title="Cancel editing">
            <IconButton
              size="small"
              aria-label={`Cancel editing ${gearSlotLabel(slotDraft.slot)} item`}
              onClick={onCancelEdit}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Confirm item for this slot">
            <span>
              <IconButton
                size="small"
                aria-label={`Confirm ${gearSlotLabel(slotDraft.slot)} item`}
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
        <Tooltip title="Edit this slot">
          <IconButton
            size="small"
            aria-label={`Edit ${gearSlotLabel(slotDraft.slot)} item`}
            onClick={onStartEdit}
            sx={{ alignSelf: "center" }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
}

export function BisListsPanel({ onClose }: BisListsPanelProps) {
  const panelRef = useScrollIntoViewOnMount<HTMLDivElement>();
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
  const selectedPresetId = selectedPreset?.id;

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
    const validated = validateBisSlotItemsText(slot, itemsText, mode);
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
  }, []);

  const handleConfirmSlot = useCallback((slotIndex: number) => {
    setSlotDrafts((previousDrafts) => {
      const slotDraft = previousDrafts[slotIndex];
      if (!slotDraft) {
        return previousDrafts;
      }

      const confirmed = confirmBisSlotItemsText(slotDraft.slot, slotDraft.itemsText);
      if (!confirmed.ok) {
        setSlotErrors((previousErrors) => ({
          ...previousErrors,
          [slotDraft.slot]: confirmed.error,
        }));
        return previousDrafts;
      }

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

      return previousDrafts.map((entry, entryIndex) =>
        entryIndex === slotIndex
          ? {
              ...entry,
              itemsText: confirmed.itemsText,
              confirmedText: confirmed.itemsText,
              itemIds: confirmed.itemIds,
            }
          : entry,
      );
    });
  }, []);

  const handleStartEditSlot = useCallback((slot: number) => {
    setEditingSlots((previousEditing) => ({ ...previousEditing, [slot]: true }));
    setError("");
  }, []);

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
      setError("Confirm all edited slots before saving the list.");
      return;
    }

    const strictErrors = collectSlotValidationErrors(slotDrafts, "strict");
    if (Object.keys(strictErrors).length > 0) {
      setSlotErrors(strictErrors);
      setError("Fix item errors before saving.");
      return;
    }

    const parsed = slotDraftsToPresetSlots(slotDrafts);
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
  }, [activeSpec, bisLists, className, hasUnconfirmedSlots, saveListName, slotDrafts]);

  const handleDeleteLocalPreset = useCallback(
    (presetId: string) => {
      bisLists.deleteLocalPreset(className, activeSpec, presetId);
      setError("");
    },
    [activeSpec, bisLists, className],
  );

  const handleClose = useCallback(() => {
    hideExternalWowTooltips();
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (selectedPreset) {
      const nextDrafts = presetToSlotDrafts(selectedPreset);
      setSlotDrafts(nextDrafts);
      setSlotErrors(collectSlotValidationErrors(nextDrafts, "strict"));
      setEditingSlots({});
      setSaveListName(
        isLocalBisPreset(selectedPreset) ? selectedPreset.name : "",
      );
    } else {
      setSlotDrafts([]);
      setSlotErrors({});
      setEditingSlots({});
      setSaveListName("");
    }
    setError("");
  }, [selectedPresetId, className, activeSpec, selectedPreset]);

  useEffect(() => () => hideExternalWowTooltips(), []);

  return (
    <Paper ref={panelRef} variant="outlined" sx={{ p: { xs: 1.25, sm: 1.5 } }}>
      <Stack spacing={1.25}>
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: "flex-start", justifyContent: "space-between" }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
              BiS lists
            </Typography>
            <Tooltip
              title="Preset best-in-slot targets per spec. Save custom lists with a name; saving again with the same name updates that list. Upgrade hints use the selected list for each character's main spec."
              placement="bottom-start"
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: "block",
                  lineHeight: 1.35,
                  cursor: "help",
                }}
              >
                Click a list to activate · confirm each slot · save under a custom name
              </Typography>
            </Tooltip>
          </Box>
          <IconButton
            size="small"
            aria-label="Close BiS lists panel"
            onClick={handleClose}
            sx={{ mt: -0.25, mr: -0.5 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
          <FormControl size="small" sx={{ minWidth: 132, flex: "1 1 132px" }}>
            <InputLabel id="bis-class-label">Class</InputLabel>
            <Select
              labelId="bis-class-label"
              label="Class"
              value={className}
              onChange={(event) => {
                const nextClass = event.target.value as ClassNameType;
                setClassName(nextClass);
                setSpec(specsForClass(nextClass)[0] ?? "");
                setError("");
              }}
            >
              {Classes.map((characterClass) => (
                <MenuItem key={characterClass.name} value={characterClass.name}>
                  {characterClass.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 112, flex: "1 1 112px" }}>
            <InputLabel id="bis-spec-label">Spec</InputLabel>
            <Select
              labelId="bis-spec-label"
              label="Spec"
              value={activeSpec}
              onChange={(event) => {
                setSpec(event.target.value);
                setError("");
              }}
            >
              {classSpecs.map((specName) => (
                <MenuItem key={specName} value={specName}>
                  {specName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        {presets.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8125rem" }}>
            No built-in BiS list for {className} {activeSpec} yet. Add presets in{" "}
            <Box component="code" sx={{ fontSize: "0.85em" }}>
              src/data/bis-presets/
            </Box>
            .
          </Typography>
        ) : (
          <>
            <Stack direction="row" spacing={0.75} sx={{ flexWrap: "wrap", gap: 0.75 }}>
              {presets.map((preset) => {
                const isSelected = preset.id === selectedPresetId;
                const isLocal = isLocalBisPreset(preset);

                return (
                  <Chip
                    key={preset.id}
                    label={preset.name}
                    variant={isSelected ? "filled" : "outlined"}
                    color={isSelected ? "primary" : "default"}
                    onClick={() => handleSelectPreset(preset.id)}
                    onDelete={
                      isLocal
                        ? () => handleDeleteLocalPreset(preset.id)
                        : undefined
                    }
                    sx={{ maxWidth: "100%" }}
                  />
                );
              })}
            </Stack>

            <Typography variant="caption" color="text.secondary">
              Hover item names for tooltips. Edit a slot, then confirm with ✓ or Enter.
            </Typography>

            <Box
              sx={{
                maxHeight: { xs: 360, md: 320 },
                overflowY: "auto",
                pr: 0.5,
                display: "grid",
                gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
                columnGap: 3,
                rowGap: 0,
                alignContent: "start",
              }}
            >
              {slotDrafts.map((slotDraft, index) => (
                <BisSlotRow
                  key={slotDraft.slot}
                  slotDraft={slotDraft}
                  validationError={slotErrors[slotDraft.slot]}
                  isEditing={isSlotEditing(slotDraft, editingSlots)}
                  onItemsTextChange={(nextValue) => {
                    setSlotDrafts((previousDrafts) =>
                      previousDrafts.map((entry, entryIndex) =>
                        entryIndex === index
                          ? { ...entry, itemsText: nextValue }
                          : entry,
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

            <Divider />

            <Stack spacing={1}>
              <TextField
                size="small"
                label="List name"
                value={saveListName}
                onChange={(event) => {
                  setSaveListName(event.target.value);
                  setError("");
                }}
                placeholder="Custom list name"
                fullWidth
              />
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveList}
                disabled={hasSlotErrors || hasUnconfirmedSlots}
                sx={{ alignSelf: "flex-start" }}
              >
                Save list
              </Button>
            </Stack>

            {!hasBuiltIn ? (
              <Typography variant="caption" color="text.secondary">
                This spec uses only local lists.
              </Typography>
            ) : null}
          </>
        )}

        {error ? <FormErrorMessage message={error} /> : null}
      </Stack>
    </Paper>
  );
}
