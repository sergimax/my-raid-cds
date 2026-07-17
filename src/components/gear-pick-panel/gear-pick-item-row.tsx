import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Box, Chip, IconButton, Stack, Typography } from "@mui/material";
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
}: {
  value: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
  decreaseAria: string;
  increaseAria: string;
  valueAria: string;
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
        sx={{ p: 0.25 }}
      >
        <RemoveIcon sx={{ fontSize: 16 }} />
      </IconButton>
      <Typography
        variant="caption"
        component="span"
        aria-label={valueAria}
        sx={{ minWidth: 16, textAlign: "center", fontWeight: 600, lineHeight: 1 }}
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
        sx={{ p: 0.25 }}
      >
        <AddIcon sx={{ fontSize: 16 }} />
      </IconButton>
    </Stack>
  );
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
  const competition = summarizeSoftCompetition(assignment, system);
  const dropCaption = [item.raidLabel, item.bossName].filter(Boolean).join(" · ");
  const weightKeys = softWeightKeys(maxSofts);

  return (
    <Box
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        px: 1,
        py: 0.75,
        display: "grid",
        gap: 0.5,
      }}
    >
      <Stack
        direction="row"
        spacing={0.75}
        sx={{ alignItems: "center", flexWrap: "wrap", columnGap: 0.75, rowGap: 0.25 }}
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
          sx={{ height: 22, "& .MuiChip-label": { px: 0.75, fontSize: "0.7rem" } }}
        />
        <WowItemLink itemId={item.itemId} />
        {dropCaption ? (
          <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
            {dropCaption}
          </Typography>
        ) : null}
      </Stack>

      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "space-between",
          columnGap: 1,
          rowGap: 0.25,
        }}
      >
        <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
          <Typography variant="caption" color="text.secondary">
            {t("gearPickPanel.mySoftsLabel")}
          </Typography>
          <SoftStepper
            value={assignment.mySofts}
            min={0}
            max={remainingBudgetForItem}
            onChange={onMySoftsChange}
            decreaseAria={t("gearPickPanel.decreaseMySoftsAria", { item: itemLabel })}
            increaseAria={t("gearPickPanel.increaseMySoftsAria", { item: itemLabel })}
            valueAria={t("gearPickPanel.mySoftsAria", { item: itemLabel })}
          />
        </Stack>
        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
          {system === "plus100"
            ? t("gearPickPanel.competitionPlus100", {
                my: competition.mySofts,
                weight: competition.competingWeight,
                callers: competition.competingCallers,
              })
            : t("gearPickPanel.competitionReroll", {
                my: competition.mySofts,
                weight: competition.competingWeight,
                callers: competition.competingCallers,
              })}
        </Typography>
      </Stack>

      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          flexWrap: "wrap",
          gap: 0.5,
          bgcolor: "action.hover",
          borderRadius: 1,
          px: 0.75,
          py: 0.25,
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ mr: 0.25 }}>
          {t("gearPickPanel.othersTitle")}
        </Typography>
        {weightKeys.map((weight, index) => {
          const count = assignment.othersByWeight[weight] ?? 0;
          return (
            <Stack
              key={weight}
              direction="row"
              spacing={0.25}
              sx={{
                alignItems: "center",
                ...(index > 0
                  ? {
                      pl: 0.75,
                      borderLeft: 1,
                      borderColor: "divider",
                    }
                  : null),
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 600, minWidth: 18 }}>
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
    </Box>
  );
}
