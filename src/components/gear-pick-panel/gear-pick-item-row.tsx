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
    <Stack direction="row" spacing={0.25} sx={{ alignItems: "center" }}>
      <IconButton
        size="small"
        aria-label={decreaseAria}
        disabled={value <= min}
        onClick={() => {
          onChange(value - 1);
        }}
      >
        <RemoveIcon fontSize="inherit" />
      </IconButton>
      <Typography
        variant="body2"
        component="span"
        aria-label={valueAria}
        sx={{ minWidth: 20, textAlign: "center", fontWeight: 600 }}
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
      >
        <AddIcon fontSize="inherit" />
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

  return (
    <Box
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        p: 1.25,
        display: "grid",
        gap: 1,
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: "flex-start", flexWrap: "wrap" }}>
        <Chip
          size="small"
          label={
            item.kind === "bis"
              ? t("gearPickPanel.kindBis")
              : t("gearPickPanel.kindVariant")
          }
          color={item.kind === "bis" ? "warning" : "default"}
          variant="outlined"
        />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <WowItemLink itemId={item.itemId} />
          {dropCaption ? (
            <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
              {dropCaption}
            </Typography>
          ) : null}
        </Box>
      </Stack>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        sx={{ alignItems: { sm: "center" }, justifyContent: "space-between" }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
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
        <Typography variant="caption" color="text.secondary">
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

      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
          {t("gearPickPanel.othersTitle")}
        </Typography>
        <Stack spacing={0.5}>
          {softWeightKeys(maxSofts).map((weight) => {
            const count = assignment.othersByWeight[weight] ?? 0;
            return (
              <Stack
                key={weight}
                direction="row"
                spacing={1}
                sx={{ alignItems: "center", justifyContent: "space-between" }}
              >
                <Typography variant="body2" sx={{ minWidth: 36 }}>
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
    </Box>
  );
}
