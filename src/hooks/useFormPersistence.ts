import { useEffect, useRef } from "react";
import type { ApplicationFormData, FormStep } from "../types/form.types";
import { StorageService } from "../services/StorageService";
import { APP_CONFIG } from "../constants";

/**
 * Hook for automatic form persistence with debouncing
 * Saves form data to localStorage after configured delay
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

    // Set new timeout for debounce delay
    timeoutRef.current = setTimeout(() => {
      StorageService.saveFormData(formData);
      StorageService.saveCurrentStep(currentStep);
    }, APP_CONFIG.DEBOUNCE_DELAY);

    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [formData, currentStep]);
};
