import type { ApplicationFormData, FormStep } from "../types/form.types";
import { STORAGE_KEYS, FORM_STEPS } from "../constants";
import { sanitizeFormData } from "../utils/sanitize";

/**
 * Service for persisting form data to localStorage
 */
export class StorageService {
  /**
   * Save form data to localStorage
   * Sanitizes data before saving to prevent injection attacks
   */
  static saveFormData(data: ApplicationFormData): void {
    try {
      // Sanitize form data before saving
      const sanitizedData = sanitizeFormData(data) as ApplicationFormData;
      const serialized = JSON.stringify(sanitizedData);
      localStorage.setItem(STORAGE_KEYS.FORM_DATA, serialized);
    } catch (error) {
      console.error("Failed to save form data:", error);
    }
  }

  /**
   * Load form data from localStorage
   */
  static loadFormData(): ApplicationFormData | null {
    try {
      const serialized = localStorage.getItem(STORAGE_KEYS.FORM_DATA);
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
      localStorage.setItem(STORAGE_KEYS.CURRENT_STEP, step.toString());
    } catch (error) {
      console.error("Failed to save current step:", error);
    }
  }

  /**
   * Load current step from localStorage
   */
  static loadCurrentStep(): FormStep | null {
    try {
      const step = localStorage.getItem(STORAGE_KEYS.CURRENT_STEP);
      if (!step) {
        return null;
      }
      const parsed = parseInt(step, 10);
      if (parsed >= FORM_STEPS.MIN_STEP && parsed <= FORM_STEPS.MAX_STEP) {
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
      localStorage.removeItem(STORAGE_KEYS.FORM_DATA);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_STEP);
    } catch (error) {
      console.error("Failed to clear form data:", error);
    }
  }

  /**
   * Check if form data exists in localStorage
   */
  static hasFormData(): boolean {
    return localStorage.getItem(STORAGE_KEYS.FORM_DATA) !== null;
  }
}
