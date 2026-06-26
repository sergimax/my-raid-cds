import CloseIcon from "@mui/icons-material/Close";
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
import { useCallback, useEffect, useMemo, useState } from "react";
import { specsForClass } from "../../data/class-specs.ts";
import { gearSlotLabel } from "../../data/gear-slot-names.ts";
import { useBisListsContext } from "../../hooks/use-bis-lists-context.ts";
import { useScrollIntoViewOnMount } from "../../hooks/use-scroll-into-view-on-mount.ts";
import { Classes, ClassName, type ClassName as ClassNameType } from "../../types/characters.ts";
import type { BisListPreset, BisListSlot } from "../../types/bis-lists.ts";
import {
  formatBisSlotItems,
  hasBuiltInBisForSpec,
  isLocalBisPreset,
  resolveItemNamesToIds,
} from "../../utils/bis-lists.ts";
import { hideExternalWowTooltips } from "../../utils/hide-external-wow-tooltips.ts";
import { FormErrorMessage } from "../form-error-message/index.tsx";

type BisListsPanelProps = {
  onClose: () => void;
};

type SlotDraft = {
  slot: number;
  itemsText: string;
  itemIds: number[];
};

const slotRowSx = {
  display: "grid",
  gridTemplateColumns: "6.25rem minmax(0, 1fr)",
  columnGap: 1,
  alignItems: "center",
  py: 0.375,
  minHeight: 32,
} as const;

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
      error: `Unknown item name or id: ${unknownNames.join(", ")}`,
    };
  }

  return { slots, error: "" };
}

type BisSlotRowProps = {
  slotDraft: SlotDraft;
  onItemsTextChange: (nextValue: string) => void;
};

function BisSlotRow({ slotDraft, onItemsTextChange }: BisSlotRowProps) {
  return (
    <Box sx={slotRowSx}>
      <Typography
        variant="caption"
        component="span"
        sx={{ fontWeight: 600, color: "text.secondary", lineHeight: 1.3 }}
      >
        {gearSlotLabel(slotDraft.slot)}
      </Typography>
      <TextField
        size="small"
        fullWidth
        value={slotDraft.itemsText}
        onChange={(event) => onItemsTextChange(event.target.value)}
        placeholder="Name, id, or #id"
        slotProps={{
          input: {
            sx: { py: 0.75, fontSize: "0.8125rem" },
          },
        }}
      />
    </Box>
  );
}

export function BisListsPanel({ onClose }: BisListsPanelProps) {
  const panelRef = useScrollIntoViewOnMount<HTMLDivElement>();
  const bisLists = useBisListsContext();
  const [className, setClassName] = useState<ClassNameType>(ClassName.DeathKnight);
  const [spec, setSpec] = useState("Unholy");
  const [slotDrafts, setSlotDrafts] = useState<SlotDraft[]>([]);
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

  const handleSaveList = useCallback(() => {
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
  }, [activeSpec, bisLists, className, saveListName, slotDrafts]);

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
      setSlotDrafts(presetToSlotDrafts(selectedPreset));
      setSaveListName(
        isLocalBisPreset(selectedPreset) ? selectedPreset.name : "",
      );
    } else {
      setSlotDrafts([]);
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
                Click a list to activate · save edits under a custom name
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
              Separate alternatives with /. Use item name, numeric id, or #id.
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
                  onItemsTextChange={(nextValue) => {
                    setSlotDrafts((previousDrafts) =>
                      previousDrafts.map((entry, entryIndex) =>
                        entryIndex === index
                          ? { ...entry, itemsText: nextValue }
                          : entry,
                      ),
                    );
                    setError("");
                  }}
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
