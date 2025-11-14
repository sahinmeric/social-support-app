import React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import type { ProgressBarProps } from "../../types/component.types";

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const steps = [
    t("steps.personalInfo"),
    t("steps.familyFinancial"),
    t("steps.situationDescriptions"),
  ];

  return (
    <Box
      sx={{
        width: "100%",
        mb: 4,
      }}
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-label={`Step ${currentStep} of ${totalSteps}`}
    >
      <Stepper
        activeStep={currentStep - 1}
        orientation={isMobile ? "vertical" : "horizontal"}
        sx={{
          "& .MuiStepLabel-root": {
            cursor: "default",
          },
          "& .MuiStepIcon-root": {
            fontSize: isMobile ? "1.5rem" : "2rem",
          },
          "& .MuiStepIcon-root.Mui-completed": {
            color: "success.main",
          },
          "& .MuiStepIcon-root.Mui-active": {
            color: "primary.main",
          },
          "& .MuiStepLabel-label": {
            fontSize: isMobile ? "0.875rem" : "1rem",
            fontWeight: 500,
          },
          "& .MuiStepLabel-label.Mui-active": {
            fontWeight: 600,
          },
        }}
      >
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <Step key={label} completed={isCompleted}>
              <StepLabel
                sx={{
                  "& .MuiStepLabel-iconContainer": {
                    pr: isMobile ? 1 : 2,
                  },
                }}
              >
                <Box
                  component="span"
                  sx={{
                    color: isActive
                      ? "primary.main"
                      : isCompleted
                        ? "text.primary"
                        : "text.secondary",
                  }}
                >
                  {label}
                </Box>
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
};

// Memoize component with custom comparison function
export default React.memo(ProgressBar, (prevProps, nextProps) => {
  // Only re-render if currentStep or totalSteps change
  return (
    prevProps.currentStep === nextProps.currentStep &&
    prevProps.totalSteps === nextProps.totalSteps
  );
});
