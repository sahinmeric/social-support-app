import React, { useCallback } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import type { TextFieldProps } from "@mui/material/TextField";

type FieldStatus = "default" | "success" | "error";

interface FormFieldProps extends Omit<TextFieldProps, "error" | "helperText"> {
  value: string | number;
  error?: string;
  helperText?: string;
  showSuccessIndicator?: boolean;
}

/**
 * Determines the status of a form field based on its value and error state
 * @param value - The current value of the field
 * @param error - The error message if validation failed
 * @returns The field status: "default", "success", or "error"
 */
const getFieldStatus = (
  value: string | number,
  error?: string
): FieldStatus => {
  if (error) return "error";

  // Check if field has meaningful content
  if (typeof value === "string") {
    if (value.trim().length > 0) return "success";
  } else if (typeof value === "number") {
    // For number fields, consider 0 as valid (e.g., 0 dependents is valid)
    if (value !== undefined && value !== null) return "success";
  }

  return "default";
};

/**
 * Enhanced form field component with success/error indicators
 * Displays a green checkmark for valid fields and a red error icon for invalid fields
 */
const FormField: React.FC<FormFieldProps> = ({
  value,
  error,
  helperText,
  showSuccessIndicator = true,
  slotProps,
  ...props
}) => {
  const status = getFieldStatus(value, error);

  const getEndAdornment = useCallback(() => {
    if (!showSuccessIndicator) return undefined;

    if (status === "success") {
      return (
        <InputAdornment position="end">
          <CheckCircleIcon
            color="success"
            aria-label="Valid input"
            sx={{ fontSize: 20 }}
          />
        </InputAdornment>
      );
    }

    if (status === "error") {
      return (
        <InputAdornment position="end">
          <ErrorIcon
            color="error"
            aria-label="Invalid input"
            sx={{ fontSize: 20 }}
          />
        </InputAdornment>
      );
    }

    return undefined;
  }, [status, showSuccessIndicator]);

  return (
    <TextField
      value={value}
      error={status === "error"}
      helperText={error || helperText}
      slotProps={{
        ...slotProps,
        input: {
          ...slotProps?.input,
          endAdornment: getEndAdornment(),
        },
      }}
      {...props}
    />
  );
};

export default React.memo(FormField);
