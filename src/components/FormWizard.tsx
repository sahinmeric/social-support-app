import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Alert,
  Snackbar,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useFormContext } from "../hooks/useFormContext";
import { APIService } from "../services/APIService";
import { StorageService } from "../services/StorageService";
import ProgressBar from "./common/ProgressBar";
import NavigationButtons from "./common/NavigationButtons";
import Step1PersonalInfo from "./steps/Step1PersonalInfo";
import Step2FamilyFinancial from "./steps/Step2FamilyFinancial";
import Step3SituationDescriptions from "./steps/Step3SituationDescriptions";
import LanguageSelector from "./common/LanguageSelector";

const FormWizard: React.FC = () => {
  const { t } = useTranslation();
  const { currentStep, setCurrentStep, validateCurrentStep, formData } =
    useFormContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * Handle navigation to next step
   */
  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < 3) {
      setCurrentStep((currentStep + 1) as 1 | 2 | 3);
      // Scroll to top when changing steps
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  /**
   * Handle navigation to previous step
   */
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as 1 | 2 | 3);
      // Scroll to top when changing steps
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async () => {
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

      if (response.success) {
        // Clear localStorage on successful submission
        StorageService.clearFormData();

        // Show success message
        setShowSuccess(true);

        // Log for demonstration
        console.log("Application submitted successfully:", {
          applicationId: response.applicationId,
          timestamp: response.timestamp,
        });

        // In a real app, you might redirect to a success page:
        // navigate('/success', { state: { applicationId: response.applicationId } });
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
  };

  /**
   * Close success snackbar
   */
  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };

  /**
   * Close error snackbar
   */
  const handleCloseError = () => {
    setShowError(false);
  };

  /**
   * Get the title for the current step
   */
  const getStepTitle = (): string => {
    switch (currentStep) {
      case 1:
        return t("steps.personalInfo");
      case 2:
        return t("steps.familyFinancial");
      case 3:
        return t("steps.situationDescriptions");
      default:
        return "";
    }
  };

  /**
   * Render the current step component
   */
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1PersonalInfo />;
      case 2:
        return <Step2FamilyFinancial />;
      case 3:
        return <Step3SituationDescriptions />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md">
      {/* Language Selector */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <LanguageSelector />
      </Box>

      {/* Step Title */}
      <Typography variant="h4" component="h1" gutterBottom align="center">
        {getStepTitle()}
      </Typography>

      {/* Progress Bar */}
      <ProgressBar currentStep={currentStep} totalSteps={3} />

      {/* Step Content */}
      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        {renderStep()}
      </Paper>

      {/* Navigation Buttons */}
      <NavigationButtons
        currentStep={currentStep}
        totalSteps={3}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isValid={true}
      />

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSuccess}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {t("submission.success")}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={showError}
        autoHideDuration={6000}
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
