/**
 * Application-wide constants
 */

/**
 * Application configuration constants
 */
export const APP_CONFIG = {
  /** Debounce delay for AI suggestion generation (ms) */
  DEBOUNCE_DELAY: 2000,
  /** Timeout for AI API requests (ms) */
  AI_TIMEOUT: 30000,
  /** Total number of form steps */
  FORM_STEPS: 3,
  /** Maximum file size for uploads (bytes) - 5MB */
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  /** Mock API delay range (ms) */
  MOCK_API_DELAY_MIN: 1000,
  MOCK_API_DELAY_MAX: 2000,
  /** AI suggestion mock delay (ms) */
  AI_MOCK_DELAY: 1500,
  /** Error snackbar auto-hide duration (ms) */
  ERROR_SNACKBAR_DURATION: 6000,
} as const;

/**
 * Breakpoint constants for responsive design
 */
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1440,
} as const;

/**
 * Form step numbers
 */
export const FORM_STEPS = {
  PERSONAL_INFO: 1,
  FAMILY_FINANCIAL: 2,
  SITUATION_DESCRIPTIONS: 3,
  MIN_STEP: 1,
  MAX_STEP: 3,
} as const;

/**
 * Scroll behavior configuration
 */
export const SCROLL_CONFIG = {
  BEHAVIOR: "smooth" as ScrollBehavior,
  TOP_POSITION: 0,
} as const;
