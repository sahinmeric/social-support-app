import React, { useState, useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import type {
  ApplicationFormData,
  FormStep,
  FormErrors,
} from "../types/form.types";
import { initialFormData } from "../types/form.types";
import { getSchemaForStep } from "../validation/schemas";
import { StorageService } from "../services/StorageService";
import { useFormPersistence } from "../hooks/useFormPersistence";
import { ValidationError } from "yup";
import { FormContext } from "./FormContext.context";
import type { FormContextValue } from "./FormContext.types";

interface FormProviderProps {
  children: ReactNode;
}

export const FormProvider: React.FC<FormProviderProps> = ({ children }) => {
  // Initialize state from localStorage or use defaults
  const [formData, setFormData] = useState<ApplicationFormData>(() => {
    const savedData = StorageService.loadFormData();
    return savedData || initialFormData;
  });

  const [currentStep, setCurrentStepState] = useState<FormStep>(() => {
    const savedStep = StorageService.loadCurrentStep();
    return savedStep || 1;
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Auto-save form data with debouncing
  useFormPersistence(formData, currentStep);

  /**
   * Update a single form field
   */
  const updateFormData = useCallback(
    (field: keyof ApplicationFormData, value: string | number): void => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  /**
   * Set the current step
   */
  const setCurrentStep = useCallback((step: FormStep): void => {
    setCurrentStepState(step);
    // Clear errors when changing steps
    setErrors({});
  }, []);

  /**
   * Validate the current step using Yup schema
   */
  const validateCurrentStep = useCallback(async (): Promise<boolean> => {
    try {
      const schema = getSchemaForStep(currentStep);
      await schema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof ValidationError) {
        const validationErrors: FormErrors = {};
        error.inner.forEach((err) => {
          if (err.path) {
            validationErrors[err.path] = err.message;
          }
        });
        setErrors(validationErrors);
        return false;
      }
      return false;
    }
  }, [currentStep, formData]);

  /**
   * Clear all validation errors
   */
  const clearErrors = useCallback((): void => {
    setErrors({});
  }, []);

  const value: FormContextValue = useMemo(
    () => ({
      formData,
      currentStep,
      errors,
      updateFormData,
      setCurrentStep,
      validateCurrentStep,
      clearErrors,
      setErrors,
    }),
    [
      formData,
      currentStep,
      errors,
      updateFormData,
      setCurrentStep,
      validateCurrentStep,
      clearErrors,
    ]
  );

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};
