import { Button, Stack } from "@mui/material";

type FormActionsRowProps = {
  submitLabel: string;
  onCancel: () => void;
};

export function FormActionsRow({ submitLabel, onCancel }: FormActionsRowProps) {
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
        Cancel
      </Button>
      <Button variant="contained" color="primary" type="submit">
        {submitLabel}
      </Button>
    </Stack>
  );
}
