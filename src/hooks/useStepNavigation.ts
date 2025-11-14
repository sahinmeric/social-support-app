import { useCallback, useMemo } from "react";
import { useFormContext } from "./useFormContext";
import { FORM_STEPS, SCROLL_CONFIG } from "../constants";
import type { FormStep } from "../types/form.types";

/**
 * Return type for useStepNavigation hook
 */
export interface UseStepNavigationReturn {
  /** Current step number */
  currentStep: FormStep;
  /** Whether navigation to next step is possible */
  canGoNext: boolean;
  /** Whether navigation to previous step is possible */
  canGoPrevious: boolean;
  /** Navigate to the next step after validation */
  handleNext: () => Promise<void>;
  /** Navigate to the previous step */
  handlePrevious: () => void;
  /** Navigate directly to a specific step */
  goToStep: (step: FormStep) => void;
}

/**
 * Custom hook for managing step navigation in the form wizard
 *
 * Encapsulates all step navigation logic including:
 * - Moving forward/backward between steps
 * - Validation before proceeding
 * - Scroll behavior on step changes
 * - Computed properties for navigation state
 *
 * @returns {UseStepNavigationReturn} Navigation state and handlers
 *
 * @example
 * ```tsx
 * const { currentStep, canGoNext, handleNext, handlePrevious } = useStepNavigation();
 *
 * return (
 *   <div>
 *     <button onClick={handlePrevious} disabled={!canGoPrevious}>
 *       Previous
 *     </button>
 *     <button onClick={handleNext} disabled={!canGoNext}>
 *       Next
 *     </button>
 *   </div>
 * );
 * ```
 */
export const useStepNavigation = (): UseStepNavigationReturn => {
  const { currentStep, setCurrentStep, validateCurrentStep } = useFormContext();

  /**
   * Scroll to top of page with smooth behavior
   */
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: SCROLL_CONFIG.TOP_POSITION,
      behavior: SCROLL_CONFIG.BEHAVIOR,
    });
  }, []);

  /**
   * Navigate to the next step after validating current step
   * Only proceeds if validation passes and not on the last step
   */
  const handleNext = useCallback(async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < FORM_STEPS.MAX_STEP) {
      setCurrentStep((currentStep + 1) as FormStep);
      scrollToTop();
    }
  }, [currentStep, validateCurrentStep, setCurrentStep, scrollToTop]);

  /**
   * Navigate to the previous step
   * Only proceeds if not on the first step
   */
  const handlePrevious = useCallback(() => {
    if (currentStep > FORM_STEPS.MIN_STEP) {
      setCurrentStep((currentStep - 1) as FormStep);
      scrollToTop();
    }
  }, [currentStep, setCurrentStep, scrollToTop]);

  /**
   * Navigate directly to a specific step
   * No validation is performed when jumping to a step
   *
   * @param step - The target step number (1, 2, or 3)
   */
  const goToStep = useCallback(
    (step: FormStep) => {
      if (step >= FORM_STEPS.MIN_STEP && step <= FORM_STEPS.MAX_STEP) {
        setCurrentStep(step);
        scrollToTop();
      }
    },
    [setCurrentStep, scrollToTop]
  );

  /**
   * Computed property: whether user can navigate to next step
   * True if not on the last step
   */
  const canGoNext = useMemo(
    () => currentStep < FORM_STEPS.MAX_STEP,
    [currentStep]
  );

  /**
   * Computed property: whether user can navigate to previous step
   * True if not on the first step
   */
  const canGoPrevious = useMemo(
    () => currentStep > FORM_STEPS.MIN_STEP,
    [currentStep]
  );

  return {
    currentStep,
    canGoNext,
    canGoPrevious,
    handleNext,
    handlePrevious,
    goToStep,
  };
};
