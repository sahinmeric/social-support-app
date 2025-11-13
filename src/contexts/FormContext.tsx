import React, { useState, useCallback, useMemo, useEffect } from "react";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { ApplicationFormData, FormStep } from "../types/form.types";
import { initialFormData } from "../types/form.types";
import { getSchemaForStep } from "../validation/schemas";
import { StorageService } from "../services/StorageService";
import { useFormPersistence } from "../hooks/useFormPersistence";
import { FormContext } from "./FormContext.context";
import type { FormContextValue } from "./FormContext.types";

interface FormProviderProps {
  children: ReactNode;
}

export const FormProvider: React.FC<FormProviderProps> = ({ children }) => {
  // Initialize state from localStorage or use defaults
  const [currentStep, setCurrentStepState] = useState<FormStep>(() => {
    const savedStep = StorageService.loadCurrentStep();
    return savedStep || 1;
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
   * Update a single form field
   */
  const updateFormData = useCallback(
    (field: keyof ApplicationFormData, value: string | number): void => {
      form.setValue(field, value as any, { shouldValidate: false });
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
   */
  const validateCurrentStep = useCallback(async (): Promise<boolean> => {
    const result = await trigger();
    return result;
  }, [trigger]);

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
    (errors: Record<string, string | undefined>): void => {
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

  const value: FormContextValue = useMemo(
    () => ({
      formData,
      currentStep,
      errors: Object.keys(errors).reduce((acc, key) => {
        acc[key] = errors[key as keyof ApplicationFormData]?.message || "";
        return acc;
      }, {} as Record<string, string>),
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
      setErrors,
    ]
  );

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};
