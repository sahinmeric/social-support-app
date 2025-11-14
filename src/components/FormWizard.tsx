import React, { useState, lazy, Suspense, useCallback, useMemo } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useTranslation } from "react-i18next";
import { useFormContext } from "../hooks/useFormContext";
import { useStepNavigation } from "../hooks/useStepNavigation";
import { useFormSubmission } from "../hooks/useFormSubmission";
import ProgressBar from "./common/ProgressBar";
import NavigationButtons from "./common/NavigationButtons";
import LanguageSelector from "./common/LanguageSelector";
import { FormSkeleton } from "./common/SkeletonLoader";
import { APP_CONFIG, FORM_STEPS } from "../constants";
import { calculateCompletionPercentage } from "../utils/progress";

// Lazy load step components for code splitting
const Step1PersonalInfo = lazy(() => import("./steps/Step1PersonalInfo"));
const Step2FamilyFinancial = lazy(() => import("./steps/Step2FamilyFinancial"));
const Step3SituationDescriptions = lazy(
  () => import("./steps/Step3SituationDescriptions")
);
const SuccessPage = lazy(() => import("./SuccessPage"));

const FormWizard: React.FC = () => {
  const { t } = useTranslation();
  const { formData, validateCurrentStep, resetForm } = useFormContext();
  const { currentStep, handleNext, handlePrevious } = useStepNavigation();
  const {
    isSubmitting,
    isSuccess,
    error: submissionError,
    submissionData,
    submitForm,
    resetSubmission,
  } = useFormSubmission();
  const [showError, setShowError] = useState(false);

  /**
   * Handle form submission
   * Memoized to prevent unnecessary re-renders of child components
   */
  const handleSubmit = useCallback(async () => {
    setShowError(false);
    await submitForm(formData, validateCurrentStep);
  }, [submitForm, formData, validateCurrentStep]);

  /**
   * Handle submit another application
   */
  const handleSubmitAnother = useCallback(() => {
    // Reset submission state
    resetSubmission();
    // Reset form to initial state and go to step 1
    resetForm();
  }, [resetSubmission, resetForm]);

  /**
   * Handle go to home page
   */
  const handleGoHome = useCallback(() => {
    // Reset form and submission state
    resetSubmission();
    resetForm();
    // In a real app, this would navigate to the home page
    // For now, just reset to step 1
  }, [resetSubmission, resetForm]);

  /**
   * Close error snackbar
   */
  const handleCloseError = () => {
    setShowError(false);
  };

  /**
   * Show error snackbar when submission error occurs
   */
  React.useEffect(() => {
    if (submissionError) {
      setShowError(true);
    }
  }, [submissionError]);

  /**
   * Calculate completion percentage
   * Memoized to avoid recalculating on every render
   */
  const completionPercentage = useMemo(
    () => calculateCompletionPercentage(formData),
    [formData]
  );

  /**
   * Get the title for the current step
   * Memoized to avoid recalculating on every render
   */
  const stepTitle = useMemo(() => {
    switch (currentStep) {
      case FORM_STEPS.PERSONAL_INFO:
        return t("steps.personalInfo");
      case FORM_STEPS.FAMILY_FINANCIAL:
        return t("steps.familyFinancial");
      case FORM_STEPS.SITUATION_DESCRIPTIONS:
        return t("steps.situationDescriptions");
      default:
        return "";
    }
  }, [currentStep, t]);

  /**
   * Render the current step component
   */
  const renderStep = () => {
    switch (currentStep) {
      case FORM_STEPS.PERSONAL_INFO:
        return <Step1PersonalInfo />;
      case FORM_STEPS.FAMILY_FINANCIAL:
        return <Step2FamilyFinancial />;
      case FORM_STEPS.SITUATION_DESCRIPTIONS:
        return <Step3SituationDescriptions />;
      default:
        return null;
    }
  };

  // Show success page after successful submission
  if (isSuccess) {
    return (
      <Suspense fallback={<FormSkeleton />}>
        <SuccessPage
          applicationId={submissionData?.applicationId}
          timestamp={submissionData?.timestamp}
          onSubmitAnother={handleSubmitAnother}
          onGoHome={handleGoHome}
        />
      </Suspense>
    );
  }

  return (
    <Container maxWidth="md">
      {/* Language Selector */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <LanguageSelector />
      </Box>

      {/* Step Title */}
      <Typography variant="h4" component="h1" gutterBottom align="center">
        {stepTitle}
      </Typography>

      {/* Progress Bar */}
      <ProgressBar
        currentStep={currentStep}
        totalSteps={APP_CONFIG.FORM_STEPS}
        completionPercentage={completionPercentage}
      />

      {/* Step Content */}
      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        <Suspense fallback={<FormSkeleton />}>{renderStep()}</Suspense>
      </Paper>

      {/* Navigation Buttons */}
      <NavigationButtons
        currentStep={currentStep}
        totalSteps={APP_CONFIG.FORM_STEPS}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isValid={true}
      />

      {/* Error Snackbar */}
      <Snackbar
        open={showError}
        autoHideDuration={APP_CONFIG.ERROR_SNACKBAR_DURATION}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {submissionError || t("submission.error")}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default FormWizard;
