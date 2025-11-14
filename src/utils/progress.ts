import type { ApplicationFormData, FormStep } from "../types/form.types";

/**
 * Required fields for each step
 */
const REQUIRED_FIELDS_BY_STEP: Record<FormStep, (keyof ApplicationFormData)[]> =
  {
    1: [
      "name",
      "nationalId",
      "dateOfBirth",
      "gender",
      "address",
      "city",
      "state",
      "country",
      "phone",
      "email",
    ],
    2: [
      "maritalStatus",
      "dependents",
      "employmentStatus",
      "monthlyIncome",
      "housingStatus",
    ],
    3: ["financialSituation", "employmentCircumstances", "reasonForApplying"],
  };

/**
 * Check if a field value is considered filled
 */
const isFieldFilled = (value: unknown): boolean => {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (typeof value === "number") {
    return true; // Numbers are always considered filled (including 0)
  }

  return false;
};

/**
 * Calculate completion percentage for a specific step
 * @param formData - The current form data
 * @param step - The step number (1, 2, or 3)
 * @returns Completion percentage (0-100)
 */
export const calculateStepCompletion = (
  formData: ApplicationFormData,
  step: FormStep
): number => {
  const requiredFields = REQUIRED_FIELDS_BY_STEP[step];

  if (!requiredFields || requiredFields.length === 0) {
    return 0;
  }

  const filledFields = requiredFields.filter((field) =>
    isFieldFilled(formData[field])
  );

  return Math.round((filledFields.length / requiredFields.length) * 100);
};

/**
 * Calculate overall form completion percentage
 * @param formData - The current form data
 * @returns Overall completion percentage (0-100)
 */
export const calculateCompletionPercentage = (
  formData: ApplicationFormData
): number => {
  const allRequiredFields = Object.values(REQUIRED_FIELDS_BY_STEP).flat();

  if (allRequiredFields.length === 0) {
    return 0;
  }

  const filledFields = allRequiredFields.filter((field) =>
    isFieldFilled(formData[field])
  );

  return Math.round((filledFields.length / allRequiredFields.length) * 100);
};
