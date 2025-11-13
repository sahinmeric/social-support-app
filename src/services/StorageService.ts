import type { ApplicationFormData, FormStep } from "../types/form.types";

const FORM_DATA_KEY = "socialSupportForm";
const CURRENT_STEP_KEY = "socialSupportFormStep";

/**
 * Service for persisting form data to localStorage
 */
export class StorageService {
  /**
   * Save form data to localStorage
   */
  static saveFormData(data: ApplicationFormData): void {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(FORM_DATA_KEY, serialized);
    } catch (error) {
      console.error("Failed to save form data:", error);
    }
  }

  /**
   * Load form data from localStorage
   */
  static loadFormData(): ApplicationFormData | null {
    try {
      const serialized = localStorage.getItem(FORM_DATA_KEY);
      if (!serialized) {
        return null;
      }
      return JSON.parse(serialized) as ApplicationFormData;
    } catch (error) {
      console.error("Failed to load form data:", error);
      return null;
    }
  }

  /**
   * Save current step to localStorage
   */
  static saveCurrentStep(step: FormStep): void {
    try {
      localStorage.setItem(CURRENT_STEP_KEY, step.toString());
    } catch (error) {
      console.error("Failed to save current step:", error);
    }
  }

  /**
   * Load current step from localStorage
   */
  static loadCurrentStep(): FormStep | null {
    try {
      const step = localStorage.getItem(CURRENT_STEP_KEY);
      if (!step) {
        return null;
      }
      const parsed = parseInt(step, 10);
      if (parsed >= 1 && parsed <= 3) {
        return parsed as FormStep;
      }
      return null;
    } catch (error) {
      console.error("Failed to load current step:", error);
      return null;
    }
  }

  /**
   * Clear all form data from localStorage
   */
  static clearFormData(): void {
    try {
      localStorage.removeItem(FORM_DATA_KEY);
      localStorage.removeItem(CURRENT_STEP_KEY);
    } catch (error) {
      console.error("Failed to clear form data:", error);
    }
  }

  /**
   * Check if form data exists in localStorage
   */
  static hasFormData(): boolean {
    return localStorage.getItem(FORM_DATA_KEY) !== null;
  }
}
