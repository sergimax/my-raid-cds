import { Typography } from "@mui/material";

type FormErrorMessageProps = {
  message: string;
};

export function FormErrorMessage({ message }: FormErrorMessageProps) {
  return (
    <Typography
      color="error"
      variant="body2"
      role="alert"
      aria-live="polite"
    >
      {message}
    </Typography>
  );
}
