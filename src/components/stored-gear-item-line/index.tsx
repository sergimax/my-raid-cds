import { Typography } from "@mui/material";
import type { CharacterGearItem } from "../../types/character-gear.ts";
import { useTranslation } from "../../i18n/use-translation.ts";
import { getLocalizedGearSlotLabel } from "../../i18n/localized-domain.ts";
import { formatStoredGearItemLevelLabel } from "../../utils/format-stored-gear.ts";
import { WowItemLink } from "../wow-item-link/index.tsx";

type StoredGearItemLineProps = {
  item: CharacterGearItem;
};

export function StoredGearItemLine({ item }: StoredGearItemLineProps) {
  const { locale } = useTranslation();

  return (
    <Typography component="span" variant="body2" color="text.secondary">
      {getLocalizedGearSlotLabel(item.slot, locale)} · <WowItemLink itemId={item.id} /> ·{" "}
      {formatStoredGearItemLevelLabel(item, locale)}
    </Typography>
  );
}
