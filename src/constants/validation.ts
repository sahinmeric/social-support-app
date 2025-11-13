/**
 * Validation constants used across the application
 */

/**
 * Minimum character lengths for text fields
 */
export const MIN_TEXT_LENGTH = {
  NAME: 2,
  NATIONAL_ID: 10,
  ADDRESS: 5,
  CITY: 2,
  STATE: 2,
  COUNTRY: 2,
  DESCRIPTION: 50, // For Step 3 text areas
} as const;

/**
 * Maximum character lengths for text fields
 */
export const MAX_TEXT_LENGTH = {
  NAME: 100,
  NATIONAL_ID: 20,
  ADDRESS: 200,
  DESCRIPTION: 1000,
} as const;

/**
 * Numeric validation limits
 */
export const NUMERIC_LIMITS = {
  MIN_VALUE: 0,
  MIN_DEPENDENTS: 0,
  MAX_DEPENDENTS: 20,
  MIN_INCOME: 0,
  MAX_INCOME: 1000000,
  MIN_AGE: 18,
  MAX_AGE: 120,
} as const;

/**
 * Regex patterns for field validation
 */
export const VALIDATION_PATTERNS = {
  NAME: /^[a-zA-Z\s\u0600-\u06FF]+$/,
  NATIONAL_ID: /^[0-9]+$/,
  PHONE: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

/**
 * Field constraints for validation
 */
export const FIELD_CONSTRAINTS = {
  name: { min: MIN_TEXT_LENGTH.NAME, max: MAX_TEXT_LENGTH.NAME },
  nationalId: {
    min: MIN_TEXT_LENGTH.NATIONAL_ID,
    max: MAX_TEXT_LENGTH.NATIONAL_ID,
  },
  address: { min: MIN_TEXT_LENGTH.ADDRESS, max: MAX_TEXT_LENGTH.ADDRESS },
  dependents: {
    min: NUMERIC_LIMITS.MIN_DEPENDENTS,
    max: NUMERIC_LIMITS.MAX_DEPENDENTS,
  },
  monthlyIncome: {
    min: NUMERIC_LIMITS.MIN_INCOME,
    max: NUMERIC_LIMITS.MAX_INCOME,
  },
  description: {
    min: MIN_TEXT_LENGTH.DESCRIPTION,
    max: MAX_TEXT_LENGTH.DESCRIPTION,
  },
} as const;

/**
 * Validation messages keys (for i18n)
 */
export const VALIDATION_MESSAGES = {
  REQUIRED: "validation.required",
  INVALID_EMAIL: "validation.invalidEmail",
  INVALID_PHONE: "validation.invalidPhone",
  INVALID_NAME: "validation.invalidName",
  INVALID_NATIONAL_ID: "validation.invalidNationalId",
  INVALID_GENDER: "validation.invalidGender",
  INVALID_MARITAL_STATUS: "validation.invalidMaritalStatus",
  INVALID_EMPLOYMENT_STATUS: "validation.invalidEmploymentStatus",
  INVALID_HOUSING_STATUS: "validation.invalidHousingStatus",
  DATE_IN_PAST: "validation.dateInPast",
  NON_NEGATIVE: "validation.nonNegative",
  MUST_BE_INTEGER: "validation.mustBeInteger",
  MIN_LENGTH: "validation.minLength",
  MAX_LENGTH: "validation.maxLength",
} as const;
