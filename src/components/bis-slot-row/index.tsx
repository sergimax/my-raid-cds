import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useRef } from "react";
import { useTranslation } from "../../i18n/use-translation.ts";
import { getLocalizedGearSlotLabel } from "../../i18n/localized-domain.ts";
import { validateBisSlotItemsText } from "../../utils/bis-lists.ts";
import {
  isSlotDraftDirty,
  type BisSlotDraft,
} from "../../utils/bis-list-editor.ts";
import type { CharacterEquipContext } from "../../utils/item-equip-restrictions.ts";
import { BisItemDropSources } from "../bis-item-drop-sources/index.tsx";
import { GearSlotIcon } from "../gear-slot-icon/index.tsx";
import { WowItemAlternatives } from "../wow-item-link/index.tsx";

const slotRowSx = {
  display: "grid",
  gridTemplateColumns: "minmax(5.75rem, 6.25rem) minmax(0, 1fr) auto",
  columnGap: 1,
  alignItems: "start",
  py: 0.375,
  minHeight: 32,
} as const;

const slotViewContentSx = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  alignSelf: "center",
  gap: 0.5,
  py: 0.5,
  fontSize: "0.8125rem",
  lineHeight: 1.35,
} as const;

export type BisSlotRowProps = {
  slotDraft: BisSlotDraft;
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

export function BisSlotRow({
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
      <Box
        sx={{
          pt: isEditing ? 0.75 : 0,
          alignSelf: isEditing ? "start" : "center",
          minWidth: 0,
          maxWidth: "100%",
          overflow: "hidden",
        }}
      >
        <GearSlotIcon slot={slotDraft.slot} />
      </Box>

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
          <BisItemDropSources itemIds={slotDraft.itemIds} locale={locale} />
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
