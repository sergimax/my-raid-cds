import { Box, Checkbox, FormControlLabel, Stack, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { exportRoleIcons } from "../../assets/role-icons/role-icons.ts";
import type { TranslateFn } from "../../i18n/translate.ts";
import { useTranslation } from "../../i18n/use-translation.ts";
import type { ExportRoleFilter, ExportRoleFilterId } from "../../utils/export-spec-role.ts";

type ExportRoleFilterProps = {
  roleFilter: ExportRoleFilter;
  onRoleFilterChange: (roleFilter: ExportRoleFilter) => void;
};

const ROLE_FILTER_MESSAGE_KEYS: Record<
  ExportRoleFilterId,
  "roleTank" | "roleHealer" | "roleMeleeDps" | "roleRangedDps"
> = {
  tank: "roleTank",
  healer: "roleHealer",
  meleeDps: "roleMeleeDps",
  rangedDps: "roleRangedDps",
};

const ROLE_FILTER_ARIA_KEYS: Record<
  ExportRoleFilterId,
  | "roleTankAria"
  | "roleHealerAria"
  | "roleMeleeDpsAria"
  | "roleRangedDpsAria"
> = {
  tank: "roleTankAria",
  healer: "roleHealerAria",
  meleeDps: "roleMeleeDpsAria",
  rangedDps: "roleRangedDpsAria",
};

const ROLE_FILTER_ROWS: readonly (readonly ExportRoleFilterId[])[] = [
  ["tank", "meleeDps"],
  ["healer", "rangedDps"],
];

const roleFilterLabelSx: SxProps<Theme> = {
  mr: 0,
  alignItems: "flex-start",
  borderRadius: 1,
  px: 0.5,
  py: 0.25,
  mx: -0.5,
  transition: (theme) =>
    theme.transitions.create(["background-color"], {
      duration: theme.transitions.duration.shortest,
    }),
  "&:hover": {
    backgroundColor: "action.hover",
    "& img": {
      filter: "brightness(1.12)",
    },
  },
  "& img": {
    transition: (theme) =>
      theme.transitions.create("filter", {
        duration: theme.transitions.duration.shortest,
      }),
  },
  "& .MuiFormControlLabel-label": { ml: 0.75 },
};

type RoleFilterOptionProps = {
  roleId: ExportRoleFilterId;
  checked: boolean;
  onCheckedChange: (included: boolean) => void;
  t: TranslateFn;
};

function RoleFilterOption({
  roleId,
  checked,
  onCheckedChange,
  t,
}: RoleFilterOptionProps) {
  return (
    <FormControlLabel
      control={
        <Checkbox
          size="small"
          checked={checked}
          onChange={(event) => {
            onCheckedChange(event.target.checked);
          }}
          slotProps={{
            input: {
              "aria-label": t(`exportPanel.${ROLE_FILTER_ARIA_KEYS[roleId]}`),
            },
          }}
          sx={{ alignSelf: "flex-start", mt: 0.25 }}
        />
      }
      label={
        <Stack spacing={0.5} sx={{ alignItems: "center", minWidth: 0 }}>
          <Box
            component="img"
            src={exportRoleIcons[roleId]}
            alt=""
            width={32}
            height={32}
            sx={{ borderRadius: "50%", flexShrink: 0, display: "block" }}
          />
          <Typography
            variant="body2"
            component="span"
            sx={{ lineHeight: 1.2, textAlign: "center" }}
          >
            {t(`exportPanel.${ROLE_FILTER_MESSAGE_KEYS[roleId]}`)}
          </Typography>
        </Stack>
      }
      sx={roleFilterLabelSx}
    />
  );
}

export function ExportRoleFilterPanel({
  roleFilter,
  onRoleFilterChange,
}: ExportRoleFilterProps) {
  const { t } = useTranslation();

  const setRoleIncluded = (roleId: ExportRoleFilterId, included: boolean) => {
    onRoleFilterChange({
      ...roleFilter,
      [roleId]: included,
    });
  };

  return (
    <Stack spacing={0.75} sx={{ minWidth: 0, pl: 0.5 }}>
      {ROLE_FILTER_ROWS.map((rowRoleIds) => (
        <Stack
          key={rowRoleIds.join("-")}
          direction="row"
          spacing={1.5}
          sx={{ alignItems: "flex-start", gap: 1.5 }}
        >
          {rowRoleIds.map((roleId) => (
            <RoleFilterOption
              key={roleId}
              roleId={roleId}
              checked={roleFilter[roleId]}
              onCheckedChange={(included) => {
                setRoleIncluded(roleId, included);
              }}
              t={t}
            />
          ))}
        </Stack>
      ))}
    </Stack>
  );
}
