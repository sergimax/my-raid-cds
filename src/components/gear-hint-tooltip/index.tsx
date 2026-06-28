import {
  Box,
  Typography,
} from "@mui/material";
import type { ItemTooltipLocale } from "../../constants/item-tooltips.ts";
import type { TranslateFn } from "../../i18n/translate.ts";
import { getLocalizedGearSlotLabel } from "../../i18n/localized-domain.ts";
import type { ClassName } from "../../types/characters.ts";
import { SpecOptionLabel } from "../spec-option-label/index.tsx";
import { WowItemAlternatives, WowItemLink } from "../wow-item-link/index.tsx";
import { formatGearUpgradeHintTooltip } from "../../utils/gear-upgrade-hint.ts";
import {
  aggregateTierSetTokenNeeds,
  formatTierSetTokenLabel,
} from "../../utils/tier-set-hint.ts";
import type { CharacterGearHints, SpecGearHint } from "../../utils/character-gear-hints.ts";
import type { BossBisLootGroup } from "../../utils/item-drop-sources.ts";

/** Scroll when boss-grouped BiS loot exceeds this height (tooltip stays scannable). */
const BIS_LOOT_LIST_MAX_HEIGHT = 128;

type GearHintTooltipContentProps = {
  gearHints: CharacterGearHints;
  characterClassName?: ClassName;
  locale: ItemTooltipLocale;
  t: TranslateFn;
};

function BisBossLootSection({
  titleKey,
  groups,
  marginBottom,
  t,
}: {
  titleKey: "gearHint.bisBossLoot" | "gearHint.bisVariantBossLoot";
  groups: readonly BossBisLootGroup[];
  marginBottom: number;
  t: TranslateFn;
}) {
  if (groups.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: marginBottom }}>
      <Typography
        variant="caption"
        component="p"
        sx={{ fontWeight: 600, mb: 0.25, lineHeight: 1.25 }}
      >
        {t(titleKey)}
      </Typography>
      <Box
        sx={{
          maxHeight: BIS_LOOT_LIST_MAX_HEIGHT,
          overflowY: "auto",
          pr: 0.25,
          scrollbarWidth: "thin",
        }}
      >
        {groups.map((group) => (
          <Typography
            key={group.bossName}
            variant="caption"
            component="div"
            sx={{
              lineHeight: 1.25,
              mb: 0.25,
              "&:last-child": { mb: 0 },
            }}
          >
            <Box component="span" sx={{ fontWeight: 600, color: "text.secondary" }}>
              {group.bossName}
              {": "}
            </Box>
            <WowItemAlternatives itemIds={group.itemIds} />
          </Typography>
        ))}
      </Box>
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
  const specName = specHint.specGear.spec;
  const hasBisLootList = specHint.bisBossLootGroups.length > 0;
  const hasBisVariantList = specHint.bisVariantBossLootGroups.length > 0;

  const gearSummary = formatGearUpgradeHintTooltip(specHint.gearHint, t, {
    showBisBossLoot: hasBisLootList,
    showBisVariantBossLoot: hasBisVariantList,
  });
  const tokenRows = aggregateTierSetTokenNeeds(specHint.tierSetHint.tokenNeeds);

  if (
    !gearSummary &&
    tokenRows.length === 0 &&
    !hasBisLootList &&
    !hasBisVariantList
  ) {
    return null;
  }

  const sectionMarginBelowLootLists = tokenRows.length > 0 ? 1 : 0;

  return (
    <Box sx={{ mb: 1, "&:last-child": { mb: 0 } }}>
      {characterClassName !== undefined ? (
        <Box
          sx={{
            mb: 0.5,
            "& .MuiTypography-root": { fontWeight: 600, color: "inherit" },
          }}
        >
          <SpecOptionLabel
            className={characterClassName}
            spec={specName}
            gearScore={specHint.specGear.gearScore}
            iconSize={16}
            variant="caption"
            color="inherit"
          />
        </Box>
      ) : (
        <Typography variant="caption" component="p" sx={{ fontWeight: 600, mb: 0.5 }}>
          {specName}
        </Typography>
      )}
      {gearSummary ? (
        <Typography
          variant="caption"
          component="p"
          sx={{
            mb:
              hasBisLootList || hasBisVariantList || tokenRows.length > 0 ? 1 : 0,
            whiteSpace: "pre-line",
          }}
        >
          {gearSummary}
        </Typography>
      ) : null}

      <BisBossLootSection
        titleKey="gearHint.bisBossLoot"
        groups={specHint.bisBossLootGroups}
        marginBottom={hasBisVariantList ? 1 : sectionMarginBelowLootLists}
        t={t}
      />

      <BisBossLootSection
        titleKey="gearHint.bisVariantBossLoot"
        groups={specHint.bisVariantBossLootGroups}
        marginBottom={sectionMarginBelowLootLists}
        t={t}
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
    <Box sx={{ maxWidth: 400 }}>
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
