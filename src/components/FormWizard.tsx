import React, { useState, lazy, Suspense, useCallback, useMemo } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useTranslation } from "react-i18next";
import { useFormContext } from "../hooks/useFormContext";
import { APIService } from "../services/APIService";
import { StorageService } from "../services/StorageService";
import ProgressBar from "./common/ProgressBar";
import NavigationButtons from "./common/NavigationButtons";
import LanguageSelector from "./common/LanguageSelector";
import { FormSkeleton } from "./common/SkeletonLoader";
import { APP_CONFIG, FORM_STEPS, SCROLL_CONFIG } from "../constants";

// Lazy load step components for code splitting
const Step1PersonalInfo = lazy(() => import("./steps/Step1PersonalInfo"));
const Step2FamilyFinancial = lazy(() => import("./steps/Step2FamilyFinancial"));
const Step3SituationDescriptions = lazy(
  () => import("./steps/Step3SituationDescriptions")
);
const SuccessPage = lazy(() => import("./SuccessPage"));

const FormWizard: React.FC = () => {
  const { t } = useTranslation();
  const { currentStep, setCurrentStep, validateCurrentStep, formData } =
    useFormContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submissionData, setSubmissionData] = useState<{
    applicationId?: string;
    timestamp?: string;
  }>({});

  /**
   * Handle navigation to next step
   * Memoized to prevent unnecessary re-renders of child components
   */
  const handleNext = useCallback(async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < FORM_STEPS.MAX_STEP) {
      setCurrentStep((currentStep + 1) as 1 | 2 | 3);
      // Scroll to top when changing steps
      window.scrollTo({
        top: SCROLL_CONFIG.TOP_POSITION,
        behavior: SCROLL_CONFIG.BEHAVIOR,
      });
    }
  }, [currentStep, validateCurrentStep, setCurrentStep]);

  /**
   * Handle navigation to previous step
   * Memoized to prevent unnecessary re-renders of child components
   */
  const handlePrevious = useCallback(() => {
    if (currentStep > FORM_STEPS.MIN_STEP) {
      setCurrentStep((currentStep - 1) as 1 | 2 | 3);
      // Scroll to top when changing steps
      window.scrollTo({
        top: SCROLL_CONFIG.TOP_POSITION,
        behavior: SCROLL_CONFIG.BEHAVIOR,
      });
    }
  }, [currentStep, setCurrentStep]);

  /**
   * Handle form submission
   * Memoized to prevent unnecessary re-renders of child components
   */
  const handleSubmit = useCallback(async () => {
    const isValid = await validateCurrentStep();
    if (!isValid) {
      setErrorMessage(t("submission.validationError"));
      setShowError(true);
      return;
    }

    setIsSubmitting(true);
    setShowError(false);

    try {
      // Submit application via API service
      const response = await APIService.submitApplication(formData);

      if (response.success && response.data) {
        // Clear localStorage on successful submission
        StorageService.clearFormData();

        // Store submission data
        setSubmissionData({
          applicationId: response.data.applicationId,
          timestamp: response.data.timestamp,
        });

        // Show success page
        setShowSuccess(true);

        // Log for demonstration
        // eslint-disable-next-line no-console
        console.log("Application submitted successfully:", {
          applicationId: response.data.applicationId,
          timestamp: response.data.timestamp,
        });
      } else {
        throw new Error(response.message || "Submission failed");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setErrorMessage(
        error instanceof Error ? error.message : t("submission.error")
      );
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [validateCurrentStep, t, formData]);

  /**
   * Handle submit another application
   */
  const handleSubmitAnother = () => {
    // Reset form state
    setShowSuccess(false);
    setSubmissionData({});
    setCurrentStep(FORM_STEPS.PERSONAL_INFO);
    // Note: FormContext will initialize with empty data from localStorage
    // which was cleared after successful submission
    window.location.reload(); // Reload to reset all state
  };

  /**
   * Handle go to home page
   */
  const handleGoHome = () => {
    // In a real app, this would navigate to the home page
    // For now, just reload the page
    window.location.href = "/";
  };

  /**
   * Close error snackbar
   */
  const handleCloseError = () => {
    setShowError(false);
  };

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
  if (showSuccess) {
    return (
      <Suspense fallback={<FormSkeleton />}>
        <SuccessPage
          applicationId={submissionData.applicationId}
          timestamp={submissionData.timestamp}
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
          {errorMessage || t("submission.error")}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default FormWizard;
