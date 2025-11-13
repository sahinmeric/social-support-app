import type { ApplicationFormData, FormStep } from "./form.types";

// ProgressBar component props
export interface ProgressBarProps {
  currentStep: FormStep;
  totalSteps: number;
}

// NavigationButtons component props
export interface NavigationButtonsProps {
  currentStep: FormStep;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isValid: boolean;
}

// Step component props
export interface StepProps {
  formData: ApplicationFormData;
  errors: Record<string, string>;
  onChange: (field: keyof ApplicationFormData, value: string | number) => void;
  onBlur: (field: keyof ApplicationFormData) => void;
}

// HelpMeWriteButton component props
export interface HelpMeWriteButtonProps {
  fieldName: keyof ApplicationFormData;
  currentValue: string;
  onAccept: (suggestion: string) => void;
  disabled?: boolean;
}

// SuggestionModal component props
export interface SuggestionModalProps {
  open: boolean;
  suggestion: string;
  isLoading: boolean;
  error: string | null;
  onAccept: () => void;
  onEdit: (text: string) => void;
  onDiscard: () => void;
  onRetry: () => void;
  onClose: () => void;
}

// LanguageSelector component props
export interface LanguageSelectorProps {
  className?: string;
}
