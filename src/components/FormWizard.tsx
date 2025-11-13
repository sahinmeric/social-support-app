import React, { useState } from "react";
import { Box, Container, Typography, Paper } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useFormContext } from "../hooks/useFormContext";
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
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Log form data for demonstration
      console.log("Form submitted:", formData);

      // Show success message
      alert(t("submission.success"));

      // In a real app, you would:
      // 1. Call APIService.submitApplication(formData)
      // 2. Handle success/error responses
      // 3. Clear localStorage on success
      // 4. Redirect to success page
    } catch (error) {
      console.error("Submission error:", error);
      alert(t("submission.error"));
    } finally {
      setIsSubmitting(false);
    }
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
    </Container>
  );
};

export default FormWizard;
