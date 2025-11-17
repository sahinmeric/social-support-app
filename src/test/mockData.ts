import type { ApplicationFormData } from "../types/form.types";

/**
 * Mock data factory for creating test form data
 */
export const createMockFormData = (
  overrides?: Partial<ApplicationFormData>
): ApplicationFormData => ({
  // Step 1: Personal Information
  name: "John Doe",
  nationalId: "1234567890",
  dateOfBirth: "1990-01-01",
  gender: "male",
  address: "123 Main Street",
  city: "Dubai",
  state: "Dubai",
  country: "UAE",
  phone: "+971501234567",
  email: "john.doe@example.com",

  // Step 2: Family & Financial Information
  maritalStatus: "married",
  dependents: 2,
  employmentStatus: "employed",
  monthlyIncome: 5000,
  currency: "AED",
  housingStatus: "rented",

  // Step 3: Situation Descriptions
  financialSituation:
    "I am currently facing financial difficulties due to unexpected medical expenses that have depleted my savings.",
  employmentCircumstances:
    "I am employed full-time but my salary is not sufficient to cover all my family's needs and the recent medical bills.",
  reasonForApplying:
    "I am applying for social support to help cover my family's basic needs while I work to recover from this financial setback.",

  ...overrides,
});

/**
 * Create partial form data for specific steps
 */
export const createStep1Data = (
  overrides?: Partial<ApplicationFormData>
): Partial<ApplicationFormData> => ({
  name: "John Doe",
  nationalId: "1234567890",
  dateOfBirth: "1990-01-01",
  gender: "male",
  address: "123 Main Street",
  city: "Dubai",
  state: "Dubai",
  country: "UAE",
  phone: "+971501234567",
  email: "john.doe@example.com",
  ...overrides,
});

export const createStep2Data = (
  overrides?: Partial<ApplicationFormData>
): Partial<ApplicationFormData> => ({
  maritalStatus: "married" as const,
  dependents: 2 as const,
  employmentStatus: "employed" as const,
  monthlyIncome: 5000 as const,
  currency: "AED" as const,
  housingStatus: "rented" as const,
  ...overrides,
});

export const createStep3Data = (
  overrides?: Partial<ApplicationFormData>
): Partial<ApplicationFormData> => ({
  financialSituation:
    "I am currently facing financial difficulties due to unexpected medical expenses.",
  employmentCircumstances:
    "I am employed full-time but my salary is not sufficient to cover all needs.",
  reasonForApplying:
    "I am applying for social support to help cover my family's basic needs.",
  ...overrides,
});

/**
 * Create invalid form data for testing validation
 */
export const createInvalidFormData = (): Partial<ApplicationFormData> => ({
  name: "",
  nationalId: "123", // Too short
  dateOfBirth: "",
  gender: "",
  address: "",
  city: "",
  state: "",
  country: "",
  phone: "invalid", // Invalid format
  email: "notanemail", // Invalid format
  maritalStatus: "",
  dependents: "",
  employmentStatus: "",
  monthlyIncome: "",
  currency: "AED",
  housingStatus: "",
  financialSituation: "Too short", // Less than 50 characters
  employmentCircumstances: "Also short", // Less than 50 characters
  reasonForApplying: "Short", // Less than 50 characters
});

/**
 * Mock API responses
 */
export const createMockSubmissionResponse = () => ({
  applicationId: `APP-${Date.now()}`,
  timestamp: new Date().toISOString(),
  status: "pending" as const,
});

/**
 * Mock AI suggestion responses
 */
export const createMockAISuggestion = (fieldName: string) => {
  const suggestions: Record<string, string> = {
    financialSituation:
      "I am currently experiencing financial hardship due to unexpected circumstances that have significantly impacted my ability to meet basic needs. Despite my best efforts to manage expenses, I find myself in need of temporary assistance to stabilize my situation.",
    employmentCircumstances:
      "My current employment situation has been affected by recent economic changes. While I am actively seeking to improve my circumstances, I require support during this transitional period to ensure my family's wellbeing.",
    reasonForApplying:
      "I am applying for social support to help bridge the gap during this challenging time. This assistance would enable me to focus on improving my situation while ensuring my family's basic needs are met.",
  };

  return (
    suggestions[fieldName] ||
    "This is a mock AI suggestion for testing purposes."
  );
};
