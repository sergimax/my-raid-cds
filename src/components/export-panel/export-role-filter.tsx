import { Checkbox, FormControlLabel, Stack, Typography } from "@mui/material";
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
        spacing={1}
        sx={{ alignItems: "center", flexWrap: "wrap", gap: 1, pl: 0.5 }}
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
              />
            }
            label={
              <Typography variant="body2" component="span">
                {t(`exportPanel.${ROLE_FILTER_MESSAGE_KEYS[roleId]}`)}
              </Typography>
            }
            sx={{ mr: 0 }}
          />
        ))}
      </Stack>
    </Stack>
  );
}
