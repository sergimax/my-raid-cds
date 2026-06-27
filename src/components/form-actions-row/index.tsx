import { Button, Stack } from "@mui/material";
import { useTranslation } from "../../i18n/use-translation.ts";

type FormActionsRowProps = {
  submitLabel: string;
  onCancel: () => void;
};

export function FormActionsRow({ submitLabel, onCancel }: FormActionsRowProps) {
  const { t } = useTranslation();

  return (
    <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
      <Button
        variant="text"
        type="button"
        onClick={(event) => {
          event.preventDefault();
          onCancel();
        }}
      >
        {t("common.cancel")}
      </Button>
      <Button variant="contained" color="primary" type="submit">
        {submitLabel}
      </Button>
    </Stack>
  );
}
