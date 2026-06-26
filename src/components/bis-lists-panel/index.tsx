import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { specsForClass } from "../../data/class-specs.ts";
import { gearSlotLabel } from "../../data/gear-slot-names.ts";
import { useBisListsContext } from "../../hooks/use-bis-lists-context.ts";
import { useScrollIntoViewOnMount } from "../../hooks/use-scroll-into-view-on-mount.ts";
import { Classes, ClassName, type ClassName as ClassNameType } from "../../types/characters.ts";
import type { BisListPreset, BisListSlot } from "../../types/bis-lists.ts";
import {
  formatBisSlotItems,
  hasBuiltInBisForSpec,
  resolveItemNamesToIds,
} from "../../utils/bis-lists.ts";
import { FormErrorMessage } from "../form-error-message/index.tsx";
import { WowItemAlternatives } from "../wow-item-link/index.tsx";

type BisListsPanelProps = {
  onClose: () => void;
};

type SlotDraft = {
  slot: number;
  itemsText: string;
  itemIds: number[];
};

function presetToSlotDrafts(preset: BisListPreset): SlotDraft[] {
  return preset.slots
    .slice()
    .sort((leftSlot, rightSlot) => leftSlot.slot - rightSlot.slot)
    .map((slotEntry) => ({
      slot: slotEntry.slot,
      itemsText: formatBisSlotItems(slotEntry.itemIds),
      itemIds: [...slotEntry.itemIds],
    }));
}

function slotDraftsToPresetSlots(slotDrafts: SlotDraft[]): {
  slots: BisListSlot[];
  error: string;
} {
  const slots: BisListSlot[] = [];
  const unknownNames: string[] = [];

  for (const slotDraft of slotDrafts) {
    const resolved = resolveItemNamesToIds(slotDraft.itemsText);
    if (resolved.unknownNames.length > 0) {
      unknownNames.push(...resolved.unknownNames);
    }
    if (resolved.itemIds.length > 0) {
      slots.push({ slot: slotDraft.slot, itemIds: resolved.itemIds });
    }
  }

  if (unknownNames.length > 0) {
    return {
      slots: [],
      error: `Unknown item name(s): ${unknownNames.join(", ")}`,
    };
  }

  return { slots, error: "" };
}

export function BisListsPanel({ onClose }: BisListsPanelProps) {
  const panelRef = useScrollIntoViewOnMount<HTMLDivElement>();
  const bisLists = useBisListsContext();
  const [className, setClassName] = useState<ClassNameType>(ClassName.DeathKnight);
  const [spec, setSpec] = useState("Unholy");
  const [editMode, setEditMode] = useState(false);
  const [slotDrafts, setSlotDrafts] = useState<SlotDraft[]>([]);
  const [copyName, setCopyName] = useState("");
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
  const displayDrafts = useMemo(
    () => (selectedPreset ? presetToSlotDrafts(selectedPreset) : []),
    [selectedPreset],
  );
  const hasBuiltIn = hasBuiltInBisForSpec(className, activeSpec);
  const hasLocalEntry = Boolean(
    bisLists.localState.entries[`${className}|${activeSpec}`],
  );
  const visibleDrafts = editMode ? slotDrafts : displayDrafts;

  const handleSelectPreset = useCallback(
    (presetId: string) => {
      bisLists.selectPreset(className, activeSpec, presetId);
      setEditMode(false);
      setError("");
    },
    [activeSpec, bisLists, className],
  );

  const handleDuplicate = useCallback(() => {
    if (!selectedPreset) {
      return;
    }
    const nextName =
      copyName.trim() ||
      `${selectedPreset.name} (local ${new Date().toLocaleDateString()})`;
    bisLists.duplicatePreset(className, activeSpec, selectedPreset, nextName);
    setCopyName("");
    setSlotDrafts(presetToSlotDrafts(selectedPreset));
    setEditMode(true);
    setError("");
  }, [activeSpec, bisLists, className, copyName, selectedPreset]);

  const handleSaveEdits = useCallback(() => {
    if (!selectedPreset) {
      return;
    }

    const parsed = slotDraftsToPresetSlots(slotDrafts);
    if (parsed.error) {
      setError(parsed.error);
      return;
    }

    bisLists.saveLocalPreset(className, activeSpec, {
      ...selectedPreset,
      slots: parsed.slots,
    });
    setEditMode(false);
    setError("");
  }, [activeSpec, bisLists, className, selectedPreset, slotDrafts]);

  const handleReset = useCallback(() => {
    bisLists.resetSpecToBuiltIn(className, activeSpec);
    setEditMode(false);
    setError("");
  }, [activeSpec, bisLists, className]);

  return (
    <Paper ref={panelRef} variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Stack
          direction="row"
          sx={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <Box>
            <Typography variant="h6">BiS lists</Typography>
            <Typography variant="body2" color="text.secondary">
              Preset best-in-slot targets per spec. Save local copies for Horde /
              Alliance or personal tweaks. Upgrade hints use the selected list for
              each character&apos;s main spec.
            </Typography>
          </Box>
          <IconButton aria-label="Close BiS lists panel" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <FormControl fullWidth size="small">
            <InputLabel id="bis-class-label">Class</InputLabel>
            <Select
              labelId="bis-class-label"
              label="Class"
              value={className}
              onChange={(event) => {
                const nextClass = event.target.value as ClassNameType;
                setClassName(nextClass);
                setSpec(specsForClass(nextClass)[0] ?? "");
                setEditMode(false);
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

          <FormControl fullWidth size="small">
            <InputLabel id="bis-spec-label">Spec</InputLabel>
            <Select
              labelId="bis-spec-label"
              label="Spec"
              value={activeSpec}
              onChange={(event) => {
                setSpec(event.target.value);
                setEditMode(false);
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

          <FormControl fullWidth size="small" disabled={presets.length === 0}>
            <InputLabel id="bis-preset-label">List</InputLabel>
            <Select
              labelId="bis-preset-label"
              label="List"
              value={selectedPreset?.id ?? ""}
              onChange={(event) => {
                handleSelectPreset(event.target.value);
              }}
            >
              {presets.map((preset) => (
                <MenuItem key={preset.id} value={preset.id}>
                  {preset.name}
                  {preset.id.startsWith("local-") ? " (local)" : ""}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        {presets.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No built-in BiS list for {className} {activeSpec} yet. Duplicate another
            spec&apos;s list or add presets in{" "}
            <Box component="code" sx={{ fontSize: "0.85em" }}>
              src/data/bis-presets/
            </Box>
            .
          </Typography>
        ) : (
          <>
            <Stack spacing={1}>
              {visibleDrafts.map((slotDraft, index) => (
                <Stack
                  key={slotDraft.slot}
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1}
                  sx={{ alignItems: { sm: "center" } }}
                >
                  <Typography
                    variant="body2"
                    sx={{ minWidth: 112, fontWeight: 600 }}
                  >
                    {gearSlotLabel(slotDraft.slot)}
                  </Typography>
                  {editMode ? (
                    <TextField
                      size="small"
                      fullWidth
                      value={slotDraft.itemsText}
                      onChange={(event) => {
                        const nextValue = event.target.value;
                        setSlotDrafts((previousDrafts) =>
                          previousDrafts.map((entry, entryIndex) =>
                            entryIndex === index
                              ? { ...entry, itemsText: nextValue }
                              : entry,
                          ),
                        );
                        setError("");
                      }}
                      placeholder="Item name / alternate item"
                      helperText="Separate alternatives with /"
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary" component="div">
                      <WowItemAlternatives itemIds={slotDraft.itemIds} />
                    </Typography>
                  )}
                </Stack>
              ))}
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              {editMode ? (
                <>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveEdits}
                  >
                    Save list
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setSlotDrafts(displayDrafts);
                      setEditMode(false);
                      setError("");
                    }}
                  >
                    Cancel edit
                  </Button>
                </>
              ) : (
                <Button
                  variant="outlined"
                  onClick={() => {
                    setSlotDrafts(displayDrafts);
                    setEditMode(true);
                    setError("");
                  }}
                >
                  Edit list
                </Button>
              )}

              <TextField
                size="small"
                label="Local copy name"
                value={copyName}
                onChange={(event) => setCopyName(event.target.value)}
                sx={{ minWidth: 200 }}
              />
              <Button
                variant="outlined"
                startIcon={<ContentCopyIcon />}
                onClick={handleDuplicate}
                disabled={!selectedPreset}
              >
                Save local copy
              </Button>

              {hasLocalEntry ? (
                <Button
                  variant="text"
                  color="warning"
                  startIcon={<RestartAltIcon />}
                  onClick={handleReset}
                >
                  Reset local lists
                </Button>
              ) : null}
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
