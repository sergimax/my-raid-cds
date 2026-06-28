import { Button, Stack } from "@mui/material";

type FormActionsRowProps = {
  submitLabel: string;
};

export function FormActionsRow({ submitLabel }: FormActionsRowProps) {
  return (
    <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
      <Button variant="contained" color="primary" type="submit">
        {submitLabel}
      </Button>
    </Stack>
  );
}
