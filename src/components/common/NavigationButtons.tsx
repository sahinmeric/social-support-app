import React, { useEffect } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { useTranslation } from "react-i18next";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import type { NavigationButtonsProps } from "../../types/component.types";
import { useLanguage } from "../../contexts/LanguageContext";

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onSubmit,
  isSubmitting,
  isValid,
}) => {
  const { t } = useTranslation();
  const { direction } = useLanguage();
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  // Handle keyboard navigation (Enter key)
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !isSubmitting) {
        event.preventDefault();
        if (isLastStep) {
          onSubmit();
        } else {
          onNext();
        }
      }
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [isLastStep, isSubmitting, onNext, onSubmit]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mt: 4,
        gap: 2,
        flexDirection: { xs: "column", sm: "row" },
      }}
    >
      {/* Previous Button */}
      <Button
        variant="outlined"
        onClick={onPrevious}
        disabled={isFirstStep || isSubmitting}
        startIcon={
          direction === "ltr" ? <ArrowBackIcon /> : <ArrowForwardIcon />
        }
        sx={{
          minWidth: { xs: "100%", sm: 120 },
          order: { xs: 2, sm: 1 },
        }}
        aria-label={t("common.previous")}
      >
        {t("common.previous")}
      </Button>

      {/* Next or Submit Button */}
      {isLastStep ? (
        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={isSubmitting || !isValid}
          startIcon={
            isSubmitting ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <CheckCircleIcon />
            )
          }
          sx={{
            minWidth: { xs: "100%", sm: 120 },
            order: { xs: 1, sm: 2 },
          }}
          aria-label={t("common.submit")}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? t("submission.submitting") : t("common.submit")}
        </Button>
      ) : (
        <Button
          variant="contained"
          onClick={onNext}
          disabled={isSubmitting}
          endIcon={
            direction === "ltr" ? <ArrowForwardIcon /> : <ArrowBackIcon />
          }
          sx={{
            minWidth: { xs: "100%", sm: 120 },
            order: { xs: 1, sm: 2 },
          }}
          aria-label={t("common.next")}
        >
          {t("common.next")}
        </Button>
      )}
    </Box>
  );
};

export default NavigationButtons;
