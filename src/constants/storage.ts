/**
 * LocalStorage key constants
 */

/**
 * Keys used for localStorage operations
 */
export const STORAGE_KEYS = {
  /** Key for storing form data */
  FORM_DATA: "socialSupportForm",
  /** Key for storing current step */
  CURRENT_STEP: "socialSupportFormStep",
  /** Key for storing language preference */
  LANGUAGE: "language",
  /** Key for storing completion percentage */
  COMPLETION_PERCENTAGE: "completionPercentage",
} as const;

/**
 * Default language value
 */
export const DEFAULT_LANGUAGE = "en" as const;

/**
 * Supported languages
 */
export const SUPPORTED_LANGUAGES = {
  ENGLISH: "en",
  ARABIC: "ar",
} as const;
