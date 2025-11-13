import { createTheme } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";

export const createAppTheme = (direction: "ltr" | "rtl"): Theme => {
  return createTheme({
    direction,
    palette: {
      primary: {
        main: "#1976d2",
        light: "#42a5f5",
        dark: "#1565c0",
      },
      secondary: {
        main: "#dc004e",
        light: "#e33371",
        dark: "#9a0036",
      },
      background: {
        default: "#f5f5f5",
        paper: "#ffffff",
      },
      error: {
        main: "#d32f2f",
      },
      success: {
        main: "#2e7d32",
      },
    },
    typography: {
      fontFamily:
        direction === "rtl"
          ? '"Cairo", "Roboto", "Helvetica", "Arial", sans-serif'
          : '"Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 500,
      },
      h6: {
        fontWeight: 500,
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 768,
        md: 1024,
        lg: 1280,
        xl: 1920,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 8,
            padding: "10px 24px",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderWidth: 2,
              },
              "&.Mui-focused": {
                outline: "2px solid",
                outlineColor: "primary.main",
                outlineOffset: 2,
              },
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            "&.Mui-focused": {
              outline: "2px solid",
              outlineColor: "primary.main",
              outlineOffset: 2,
            },
          },
        },
      },
    },
  });
};
