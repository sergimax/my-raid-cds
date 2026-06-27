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
import { getLocalizedGearSlotLabel, getLocalizedSpecName } from "../../i18n/localized-domain.ts";
import type { ClassName } from "../../types/characters.ts";
import { WowItemLink } from "../wow-item-link/index.tsx";
import { formatGearUpgradeHintTooltip } from "../../utils/gear-upgrade-hint.ts";
import {
  aggregateTierSetTokenNeeds,
  formatTierSetTokenLabel,
} from "../../utils/tier-set-hint.ts";
import type { CharacterGearHints, SpecGearHint } from "../../utils/character-gear-hints.ts";

type GearHintTooltipContentProps = {
  gearHints: CharacterGearHints;
  characterClassName?: ClassName;
  locale: ItemTooltipLocale;
  t: TranslateFn;
};

function SpecGearHintSection({
  specHint,
  characterClassName,
  locale,
  t,
}: {
  specHint: SpecGearHint;
  characterClassName?: ClassName;
  locale: ItemTooltipLocale;
  t: TranslateFn;
}) {
  const gearSummary = formatGearUpgradeHintTooltip(specHint.gearHint, locale, t);
  const tokenRows = aggregateTierSetTokenNeeds(specHint.tierSetHint.tokenNeeds);
  const specLabel =
    characterClassName !== undefined
      ? getLocalizedSpecName(characterClassName, specHint.specGear.spec, locale)
      : specHint.specGear.spec;

  if (!gearSummary && tokenRows.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: 1, "&:last-child": { mb: 0 } }}>
      <Typography variant="caption" component="p" sx={{ fontWeight: 600, mb: 0.5 }}>
        {specLabel}
      </Typography>
      {gearSummary ? (
        <Typography variant="caption" component="p" sx={{ mb: tokenRows.length > 0 ? 1 : 0 }}>
          {gearSummary}
        </Typography>
      ) : null}

      {tokenRows.length > 0 ? (
        <>
          <Typography variant="caption" component="p" sx={{ fontWeight: 600, mb: 0.5 }}>
            {t("tierSet.tokensFromRaid", { count: tokenRows.length })}
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

export function GearHintTooltipContent({
  gearHints,
  characterClassName,
  locale,
  t,
}: GearHintTooltipContentProps) {
  const sections = [gearHints.main, gearHints.off].filter(
    (specHint): specHint is SpecGearHint => specHint !== undefined,
  );

  if (sections.length === 0) {
    return null;
  }

  return (
    <Box sx={{ maxWidth: 360 }}>
      {sections.map((specHint) => (
        <SpecGearHintSection
          key={specHint.specGear.spec}
          specHint={specHint}
          characterClassName={characterClassName}
          locale={locale}
          t={t}
        />
      ))}
    </Box>
  );
}
