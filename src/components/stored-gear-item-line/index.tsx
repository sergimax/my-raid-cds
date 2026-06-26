import { Typography } from "@mui/material";
import type { CharacterGearItem } from "../../types/character-gear.ts";
import { gearSlotLabel } from "../../data/gear-slot-names.ts";
import { formatStoredGearItemLevelLabel } from "../../utils/format-stored-gear.ts";
import { WowItemLink } from "../wow-item-link/index.tsx";

type StoredGearItemLineProps = {
  item: CharacterGearItem;
};

export function StoredGearItemLine({ item }: StoredGearItemLineProps) {
  return (
    <Typography component="span" variant="body2" color="text.secondary">
      {gearSlotLabel(item.slot)} · <WowItemLink itemId={item.id} /> ·{" "}
      {formatStoredGearItemLevelLabel(item)}
    </Typography>
  );
}
