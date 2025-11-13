import React, { useState } from "react";
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
  const updateFormData = (
    field: keyof ApplicationFormData,
    value: string | number
  ): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  /**
   * Set the current step
   */
  const setCurrentStep = (step: FormStep): void => {
    setCurrentStepState(step);
    // Clear errors when changing steps
    setErrors({});
  };

  /**
   * Validate the current step using Yup schema
   */
  const validateCurrentStep = async (): Promise<boolean> => {
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
  };

  /**
   * Clear all validation errors
   */
  const clearErrors = (): void => {
    setErrors({});
  };

  const value: FormContextValue = {
    formData,
    currentStep,
    errors,
    updateFormData,
    setCurrentStep,
    validateCurrentStep,
    clearErrors,
    setErrors,
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};
