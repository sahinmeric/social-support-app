import React, { useState, useCallback, useMemo, useEffect } from "react";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type {
  ApplicationFormData,
  FormStep,
  FormErrors,
} from "../types/form.types";
import { initialFormData } from "../types/form.types";
import { getSchemaForStep } from "../validation/schemas";
import { StorageService } from "../services/StorageService";
import { useFormPersistence } from "../hooks/useFormPersistence";
import { FormContext } from "./FormContext.context";
import type { FormContextValue } from "./FormContext.types";
import { FORM_STEPS } from "../constants";
import { PerformanceMonitor } from "../utils/performance";

interface FormProviderProps {
  children: ReactNode;
}

export const FormProvider: React.FC<FormProviderProps> = ({ children }) => {
  // Initialize state from localStorage or use defaults
  const [currentStep, setCurrentStepState] = useState<FormStep>(() => {
    const savedStep = StorageService.loadCurrentStep();
    return savedStep || FORM_STEPS.PERSONAL_INFO;
  });

  // Initialize React Hook Form
  const form = useForm<ApplicationFormData>({
    defaultValues: StorageService.loadFormData() || initialFormData,
    resolver: yupResolver(getSchemaForStep(currentStep)),
    mode: "onChange",
  });

  const { watch, trigger, formState } = form;
  const formData = watch();
  const errors = formState.errors;

  // Auto-save form data with debouncing
  useFormPersistence(formData, currentStep);

  // Update resolver when step changes
  useEffect(() => {
    form.clearErrors();
  }, [currentStep, form]);

  /**
   * Update a single form field with type safety
   */
  const updateFormData = useCallback(
    <K extends keyof ApplicationFormData>(
      field: K,
      value: ApplicationFormData[K]
    ): void => {
      // Type assertion needed due to react-hook-form's complex path types
      form.setValue(field, value as never, { shouldValidate: false });
    },
    [form]
  );

  /**
   * Set the current step
   */
  const setCurrentStep = useCallback((step: FormStep): void => {
    setCurrentStepState(step);
  }, []);

  /**
   * Validate the current step using Yup schema
   * Performance monitored for optimization tracking
   */
  const validateCurrentStep = useCallback(async (): Promise<boolean> => {
    const result = await PerformanceMonitor.measureAsync(
      `Form Validation - Step ${currentStep}`,
      async () => await trigger()
    );
    return result;
  }, [trigger, currentStep]);

  /**
   * Clear all validation errors
   */
  const clearErrors = useCallback((): void => {
    form.clearErrors();
  }, [form]);

  /**
   * Set errors manually
   */
  const setErrors = useCallback(
    (errors: FormErrors): void => {
      Object.entries(errors).forEach(([field, message]) => {
        if (message) {
          form.setError(field as keyof ApplicationFormData, {
            type: "manual",
            message,
          });
        }
      });
    },
    [form]
  );

  /**
   * Reset form to initial state
   */
  const resetForm = useCallback((): void => {
    form.reset(initialFormData);
    setCurrentStepState(FORM_STEPS.PERSONAL_INFO);
    StorageService.clearFormData();
  }, [form]);

  const value: FormContextValue = useMemo(
    () => ({
      formData,
      currentStep,
      errors: Object.keys(errors).reduce<FormErrors>((acc, key) => {
        acc[key] = errors[key as keyof ApplicationFormData]?.message || "";
        return acc;
      }, {}),
      updateFormData,
      setCurrentStep,
      validateCurrentStep,
      clearErrors,
      setErrors,
      resetForm,
    }),
    [
      formData,
      currentStep,
      errors,
      updateFormData,
      setCurrentStep,
      validateCurrentStep,
      clearErrors,
      setErrors,
      resetForm,
    ]
  );

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};
