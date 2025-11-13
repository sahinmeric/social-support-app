import type {
  ApplicationFormData,
  FormStep,
  FormErrors,
} from "../types/form.types";

export interface FormContextValue {
  formData: ApplicationFormData;
  currentStep: FormStep;
  errors: FormErrors;
  updateFormData: <K extends keyof ApplicationFormData>(
    field: K,
    value: ApplicationFormData[K]
  ) => void;
  setCurrentStep: (step: FormStep) => void;
  validateCurrentStep: () => Promise<boolean>;
  clearErrors: () => void;
  setErrors: (errors: FormErrors) => void;
}
