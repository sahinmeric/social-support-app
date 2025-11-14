import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import type { ApplicationFormData } from "../types/form.types";
import type { SubmissionData } from "../types/api.types";
import { APIService } from "../services/APIService";
import { StorageService } from "../services/StorageService";

/**
 * Return type for useFormSubmission hook
 */
export interface UseFormSubmissionReturn {
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
  submissionData: SubmissionData | null;
  submitForm: (
    formData: ApplicationFormData,
    validateCurrentStep: () => Promise<boolean>
  ) => Promise<void>;
  resetSubmission: () => void;
}

/**
 * Custom hook for handling form submission logic
 * Encapsulates submission state management and API interaction
 *
 * @returns {UseFormSubmissionReturn} Submission state and control functions
 *
 * @example
 * ```tsx
 * const { isSubmitting, isSuccess, error, submitForm, resetSubmission } = useFormSubmission();
 *
 * const handleSubmit = async () => {
 *   await submitForm(formData, validateCurrentStep);
 * };
 * ```
 */
export const useFormSubmission = (): UseFormSubmissionReturn => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submissionData, setSubmissionData] = useState<SubmissionData | null>(
    null
  );

  /**
   * Submit the form to the API
   * Validates, submits, and handles success/error states
   */
  const submitForm = useCallback(
    async (
      formData: ApplicationFormData,
      validateCurrentStep: () => Promise<boolean>
    ): Promise<void> => {
      // Validate current step before submission
      const isValid = await validateCurrentStep();
      if (!isValid) {
        setError(t("submission.validationError"));
        return;
      }

      setIsSubmitting(true);
      setError(null);

      try {
        // Submit application via API service
        const response = await APIService.submitApplication(formData);

        if (response.success && response.data) {
          // Clear localStorage on successful submission
          StorageService.clearFormData();

          // Store submission data
          setSubmissionData(response.data);

          // Mark as successful
          setIsSuccess(true);

          // Log for demonstration
          // eslint-disable-next-line no-console
          console.log("Application submitted successfully:", {
            applicationId: response.data.applicationId,
            timestamp: response.data.timestamp,
          });
        } else {
          throw new Error(response.message || "Submission failed");
        }
      } catch (err) {
        console.error("Submission error:", err);
        const errorMessage =
          err instanceof Error ? err.message : t("submission.error");
        setError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [t]
  );

  /**
   * Reset submission state
   * Used when starting a new submission or clearing errors
   */
  const resetSubmission = useCallback((): void => {
    setIsSubmitting(false);
    setIsSuccess(false);
    setError(null);
    setSubmissionData(null);
  }, []);

  return {
    isSubmitting,
    isSuccess,
    error,
    submissionData,
    submitForm,
    resetSubmission,
  };
};
