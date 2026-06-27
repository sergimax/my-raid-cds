import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { ItemTooltipLocale } from "../../constants/item-tooltips.ts";
import type { TranslateFn } from "../../i18n/translate.ts";
import { getLocalizedGearSlotLabel } from "../../i18n/localized-domain.ts";
import { WowItemLink } from "../wow-item-link/index.tsx";
import type { GearUpgradeHint } from "../../utils/gear-upgrade-hint.ts";
import { formatGearUpgradeHintTooltip } from "../../utils/gear-upgrade-hint.ts";
import {
  aggregateTierSetTokenNeeds,
  formatTierSetTokenLabel,
} from "../../utils/tier-set-hint.ts";
import type { TierSetHint } from "../../types/tier-sets.ts";

type GearHintTooltipContentProps = {
  gearHint: GearUpgradeHint;
  tierSetHint: TierSetHint;
  locale: ItemTooltipLocale;
  t: TranslateFn;
};

export function GearHintTooltipContent({
  gearHint,
  tierSetHint,
  locale,
  t,
}: GearHintTooltipContentProps) {
  const gearSummary = formatGearUpgradeHintTooltip(gearHint, locale, t);
  const tokenRows = aggregateTierSetTokenNeeds(tierSetHint.tokenNeeds);

  if (!gearSummary && tokenRows.length === 0) {
    return null;
  }

  return (
    <Box sx={{ maxWidth: 360 }}>
      {gearSummary ? (
        <Typography variant="caption" component="p" sx={{ mb: tokenRows.length > 0 ? 1 : 0 }}>
          {gearSummary}
        </Typography>
      ) : null}

      {tokenRows.length > 0 ? (
        <>
          <Typography variant="caption" component="p" sx={{ fontWeight: 600, mb: 0.5 }}>
            {t("tierSet.tokensFromRaid", { count: tierSetHint.tokenNeeds.length })}
          </Typography>
          <Table size="small" sx={{ "& td, & th": { border: 0, py: 0.25, px: 0.5 } }}>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="caption">{t("tierSet.tokenColumn")}</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="caption">{t("tierSet.countColumn")}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="caption">{t("tierSet.slotsColumn")}</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tokenRows.map((row) => (
                <TableRow key={row.tokenItemId}>
                  <TableCell>
                    <Typography variant="caption" component="span">
                      <WowItemLink itemId={row.tokenItemId}>
                        {formatTierSetTokenLabel(row.tokenItemId, locale)}
                      </WowItemLink>
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="caption">{row.count}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      {row.slots
                        .map((slot) => getLocalizedGearSlotLabel(slot, locale))
                        .join(", ")}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      ) : null}
    </Box>
  );
}
