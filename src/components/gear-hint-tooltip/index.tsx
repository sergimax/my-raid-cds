import {
  Box,
  Typography,
} from "@mui/material";
import type { ItemTooltipLocale } from "../../constants/item-tooltips.ts";
import type { TranslateFn } from "../../i18n/translate.ts";
import { getLocalizedGearSlotLabel, getLocalizedSpecName } from "../../i18n/localized-domain.ts";
import type { ClassName } from "../../types/characters.ts";
import { WowItemAlternatives, WowItemLink } from "../wow-item-link/index.tsx";
import { formatGearUpgradeHintTooltip } from "../../utils/gear-upgrade-hint.ts";
import {
  aggregateTierSetTokenNeeds,
  formatTierSetTokenLabel,
} from "../../utils/tier-set-hint.ts";
import type { CharacterGearHints, SpecGearHint } from "../../utils/character-gear-hints.ts";
import type { BossBisLootGroup } from "../../utils/item-drop-sources.ts";

type GearHintTooltipContentProps = {
  gearHints: CharacterGearHints;
  characterClassName?: ClassName;
  locale: ItemTooltipLocale;
  t: TranslateFn;
};

function BisBossLootSection({
  groups,
  t,
  marginBottom,
}: {
  groups: readonly BossBisLootGroup[];
  t: TranslateFn;
  marginBottom: number;
}) {
  if (groups.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: marginBottom }}>
      <Typography variant="caption" component="p" sx={{ fontWeight: 600, mb: 0.5 }}>
        {t("gearHint.bisBossLoot")}
      </Typography>
      {groups.map((group) => (
        <Box key={group.bossName} sx={{ mb: 0.5, "&:last-child": { mb: 0 } }}>
          <Typography variant="caption" component="p" sx={{ fontWeight: 600 }}>
            {group.bossName}
          </Typography>
          <Typography variant="caption" component="p">
            <WowItemAlternatives itemIds={group.itemIds} />
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

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
  const bossLootGroups = specHint.bisBossLootGroups;
  const specLabel =
    characterClassName !== undefined
      ? getLocalizedSpecName(characterClassName, specHint.specGear.spec, locale)
      : specHint.specGear.spec;

  if (!gearSummary && tokenRows.length === 0 && bossLootGroups.length === 0) {
    return null;
  }

  const sectionMarginBelowBossLoot = tokenRows.length > 0 ? 1 : 0;

  return (
    <Box sx={{ mb: 1, "&:last-child": { mb: 0 } }}>
      <Typography variant="caption" component="p" sx={{ fontWeight: 600, mb: 0.5 }}>
        {specLabel}
      </Typography>
      {gearSummary ? (
        <Typography
          variant="caption"
          component="p"
          sx={{
            mb:
              bossLootGroups.length > 0 || tokenRows.length > 0 ? 1 : 0,
            whiteSpace: "pre-line",
          }}
        >
          {gearSummary}
        </Typography>
      ) : null}

      <BisBossLootSection
        groups={bossLootGroups}
        t={t}
        marginBottom={sectionMarginBelowBossLoot}
      />

      {tokenRows.length > 0 ? (
        <Box>
          <Typography variant="caption" component="p" sx={{ fontWeight: 600, mb: 0.5 }}>
            {t("tierSet.tokensFromRaid", { count: tokenRows.length })}
          </Typography>
          {tokenRows.map((row) => (
            <Typography
              key={row.tokenItemId}
              variant="caption"
              component="p"
              sx={{ mb: 0.25, "&:last-child": { mb: 0 } }}
            >
              <WowItemLink itemId={row.tokenItemId}>
                {formatTierSetTokenLabel(row.tokenItemId, locale)}
              </WowItemLink>
              {" ×"}
              {row.count}
              {" — "}
              {row.slots
                .map((slot) => getLocalizedGearSlotLabel(slot, locale))
                .join(", ")}
            </Typography>
          ))}
        </Box>
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
