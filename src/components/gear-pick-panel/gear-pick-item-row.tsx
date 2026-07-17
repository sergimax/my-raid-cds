import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Box, Chip, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import type { TranslateFn } from "../../i18n/translate.ts";
import type { GearPickItem } from "../../utils/build-gear-pick-items.ts";
import {
  softWeightKeys,
  summarizeSoftCompetition,
  type ItemSoftAssignment,
  type SoftRollMax,
  type SoftRollSystem,
} from "../../utils/gear-pick-soft-roll.ts";
import { WowItemLink } from "../wow-item-link/index.tsx";

type GearPickItemRowProps = {
  item: GearPickItem;
  assignment: ItemSoftAssignment;
  maxSofts: SoftRollMax;
  system: SoftRollSystem;
  remainingBudgetForItem: number;
  itemLabel: string;
  onMySoftsChange: (mySofts: number) => void;
  onOthersCountChange: (weight: number, count: number) => void;
  t: TranslateFn;
};

function SoftStepper({
  value,
  min,
  max,
  onChange,
  decreaseAria,
  increaseAria,
  valueAria,
  emphasized = false,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
  decreaseAria: string;
  increaseAria: string;
  valueAria: string;
  emphasized?: boolean;
}) {
  return (
    <Stack direction="row" spacing={0} sx={{ alignItems: "center" }}>
      <IconButton
        size="small"
        aria-label={decreaseAria}
        disabled={value <= min}
        onClick={() => {
          onChange(value - 1);
        }}
        sx={{ p: emphasized ? 0.35 : 0.2 }}
      >
        <RemoveIcon sx={{ fontSize: emphasized ? 18 : 15 }} />
      </IconButton>
      <Typography
        variant={emphasized ? "body2" : "caption"}
        component="span"
        aria-label={valueAria}
        sx={{
          minWidth: emphasized ? 22 : 14,
          textAlign: "center",
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        {value}
      </Typography>
      <IconButton
        size="small"
        aria-label={increaseAria}
        disabled={value >= max}
        onClick={() => {
          onChange(value + 1);
        }}
        sx={{ p: emphasized ? 0.35 : 0.2 }}
      >
        <AddIcon sx={{ fontSize: emphasized ? 18 : 15 }} />
      </IconButton>
    </Stack>
  );
}

function competitionCaption(
  competition: ReturnType<typeof summarizeSoftCompetition>,
  maxSofts: SoftRollMax,
  t: TranslateFn,
): { text: string; hint: string; warn: boolean } {
  const belowMax = Math.max(1, maxSofts - 1);

  if (competition.system === "reroll") {
    return {
      text: t("gearPickPanel.competitionReroll", {
        myRolls: competition.myRollCount,
        otherRolls: competition.othersRollCount,
        callers: competition.competingCallers,
      }),
      hint: t("gearPickPanel.competitionRerollHint", {
        myRolls: competition.myRollCount,
        mySofts: competition.mySofts,
        callers: competition.competingCallers,
        weight: competition.competingWeight,
        otherRolls: competition.othersRollCount,
      }),
      warn: false,
    };
  }

  const plus100Hint = t("gearPickPanel.competitionPlus100Hint", {
    max: maxSofts,
    belowMax,
  });

  if (competition.mySoftsDominated) {
    return {
      text: t("gearPickPanel.competitionPlus100Dominated", {
        my: competition.mySofts,
        max: maxSofts,
        count: competition.maxSoftCallerCount,
      }),
      hint: plus100Hint,
      warn: true,
    };
  }

  if (competition.maxSoftCallerCount > 0) {
    return {
      text: t("gearPickPanel.competitionPlus100MaxCaller", {
        max: maxSofts,
        count: competition.maxSoftCallerCount,
      }),
      hint: plus100Hint,
      warn: true,
    };
  }

  return {
    text: t("gearPickPanel.competitionPlus100", {
      my: competition.mySofts,
      weight: competition.competingWeight,
      callers: competition.competingCallers,
    }),
    hint: plus100Hint,
    warn: false,
  };
}

export function GearPickItemRow({
  item,
  assignment,
  maxSofts,
  system,
  remainingBudgetForItem,
  itemLabel,
  onMySoftsChange,
  onOthersCountChange,
  t,
}: GearPickItemRowProps) {
  const competition = summarizeSoftCompetition(assignment, system, maxSofts);
  const dropCaption = [item.raidLabel, item.bossName].filter(Boolean).join(" · ");
  const weightKeys = softWeightKeys(maxSofts);
  const caption = competitionCaption(competition, maxSofts, t);
  const hasMaxSoftCaller = competition.maxSoftCallerCount > 0;

  return (
    <Box
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        px: 0.75,
        py: 0.5,
      }}
    >
      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          flexWrap: "wrap",
          columnGap: 0.75,
          rowGap: 0.5,
        }}
      >
        <Stack
          direction="row"
          spacing={0.75}
          sx={{ alignItems: "center", flexWrap: "wrap", minWidth: 0 }}
        >
          <Chip
            size="small"
            label={
              item.kind === "bis"
                ? t("gearPickPanel.kindBis")
                : t("gearPickPanel.kindVariant")
            }
            color={item.kind === "bis" ? "warning" : "default"}
            variant="outlined"
            sx={{ height: 20, "& .MuiChip-label": { px: 0.6, fontSize: "0.65rem" } }}
          />
          <WowItemLink itemId={item.itemId} />
          {dropCaption ? (
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
              {dropCaption}
            </Typography>
          ) : null}
          <Stack
            direction="row"
            sx={{
              alignItems: "center",
              flexShrink: 0,
              px: 0.5,
              py: 0.15,
              border: 1,
              borderColor: competition.mySoftsDominated ? "warning.main" : "primary.main",
              borderRadius: 1,
              bgcolor: "action.selected",
            }}
          >
            <SoftStepper
              value={assignment.mySofts}
              min={0}
              max={remainingBudgetForItem}
              onChange={onMySoftsChange}
              decreaseAria={t("gearPickPanel.decreaseMySoftsAria", { item: itemLabel })}
              increaseAria={t("gearPickPanel.increaseMySoftsAria", { item: itemLabel })}
              valueAria={t("gearPickPanel.mySoftsAria", { item: itemLabel })}
              emphasized
            />
          </Stack>
        </Stack>

        <Stack
          direction="row"
          aria-label={t("gearPickPanel.othersTitle")}
          sx={{ alignItems: "center", flexWrap: "wrap", gap: 0.5 }}
        >
          {weightKeys.map((weight) => {
            const count = assignment.othersByWeight[weight] ?? 0;
            const isMaxWeight = weight === maxSofts;
            const dominatedWeight =
              system === "plus100" && hasMaxSoftCaller && !isMaxWeight;
            return (
              <Stack
                key={weight}
                direction="row"
                spacing={0.35}
                sx={{
                  alignItems: "center",
                  px: 0.6,
                  py: 0.15,
                  border: 1,
                  borderColor: isMaxWeight && hasMaxSoftCaller ? "warning.main" : "divider",
                  borderRadius: 1,
                  bgcolor: "action.hover",
                  opacity: dominatedWeight ? 0.55 : 1,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    minWidth: 18,
                    lineHeight: 1,
                    textDecoration: dominatedWeight ? "line-through" : "none",
                  }}
                >
                  {t("gearPickPanel.othersWeightLabel", { weight })}
                </Typography>
                <SoftStepper
                  value={count}
                  min={0}
                  max={99}
                  onChange={(next) => {
                    onOthersCountChange(weight, next);
                  }}
                  decreaseAria={t("gearPickPanel.decreaseOthersAria", {
                    weight,
                    item: itemLabel,
                  })}
                  increaseAria={t("gearPickPanel.increaseOthersAria", {
                    weight,
                    item: itemLabel,
                  })}
                  valueAria={t("gearPickPanel.othersWeightAria", {
                    weight,
                    item: itemLabel,
                  })}
                />
              </Stack>
            );
          })}
        </Stack>

        <Tooltip title={caption.hint}>
          <Typography
            variant="caption"
            color={caption.warn ? "warning.main" : "text.secondary"}
            sx={{
              lineHeight: 1.2,
              fontWeight: caption.warn ? 600 : 400,
              borderBottom: "1px dotted",
              borderColor: "currentColor",
              cursor: "help",
            }}
          >
            {caption.text}
          </Typography>
        </Tooltip>
      </Stack>
    </Box>
  );
}
