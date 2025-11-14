import React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import type { ProgressBarProps } from "../../types/component.types";

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  completionPercentage,
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
      data-testid="progress-bar"
    >
      {/* Overall completion percentage */}
      {completionPercentage !== undefined && (
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 1, fontWeight: 500 }}
          >
            {t("progress.overallCompletion")}: {completionPercentage}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={completionPercentage}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: "action.hover",
              "& .MuiLinearProgress-bar": {
                borderRadius: 4,
                backgroundColor: "success.main",
              },
            }}
          />
        </Box>
      )}

      {/* Step indicators */}
      <Box>
        <Stepper
          activeStep={currentStep - 1}
          orientation={isMobile ? "vertical" : "horizontal"}
          data-testid="step-indicator"
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
    </Box>
  );
};

// Memoize component with custom comparison function
export default React.memo(ProgressBar, (prevProps, nextProps) => {
  // Only re-render if currentStep, totalSteps, or completionPercentage change
  return (
    prevProps.currentStep === nextProps.currentStep &&
    prevProps.totalSteps === nextProps.totalSteps &&
    prevProps.completionPercentage === nextProps.completionPercentage
  );
});
