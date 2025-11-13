import { useEffect, useRef } from "react";
import type { ApplicationFormData, FormStep } from "../types/form.types";
import { StorageService } from "../services/StorageService";

/**
 * Hook for automatic form persistence with debouncing
 * Saves form data to localStorage after 2 seconds of inactivity
 */
export const useFormPersistence = (
  formData: ApplicationFormData,
  currentStep: FormStep
): void => {
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for 2 seconds
    timeoutRef.current = setTimeout(() => {
      StorageService.saveFormData(formData);
      StorageService.saveCurrentStep(currentStep);
    }, 2000);

    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [formData, currentStep]);
};
