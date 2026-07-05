import { Box, Checkbox, FormControlLabel, Stack, Typography } from "@mui/material";
import { exportRoleIcons } from "../../assets/role-icons/role-icons.ts";
import { useTranslation } from "../../i18n/use-translation.ts";
import {
  EXPORT_ROLE_FILTER_IDS,
  type ExportRoleFilter,
  type ExportRoleFilterId,
} from "../../utils/export-spec-role.ts";

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
    <Stack spacing={0.5} sx={{ minWidth: 0 }}>
      <Stack
        direction="row"
        spacing={1.5}
        sx={{ alignItems: "flex-start", flexWrap: "wrap", gap: 1.5, pl: 0.5 }}
      >
        {EXPORT_ROLE_FILTER_IDS.map((roleId) => (
          <FormControlLabel
            key={roleId}
            control={
              <Checkbox
                size="small"
                checked={roleFilter[roleId]}
                onChange={(event) => {
                  setRoleIncluded(roleId, event.target.checked);
                }}
                slotProps={{
                  input: {
                    "aria-label": t(
                      `exportPanel.${ROLE_FILTER_ARIA_KEYS[roleId]}`,
                    ),
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
            sx={{
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
            }}
          />
        ))}
      </Stack>
    </Stack>
  );
}
