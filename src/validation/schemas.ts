import * as yup from "yup";

// Helper function to check if date is in the past
const isPastDate = (date: Date | undefined): boolean => {
  if (!date) return false;
  return date < new Date();
};

// Step 1: Personal Information validation schema
export const step1Schema = yup.object().shape({
  name: yup
    .string()
    .required("validation.required")
    .min(2, "validation.minLength")
    .matches(/^[a-zA-Z\s\u0600-\u06FF]+$/, "validation.invalidName"),

  nationalId: yup
    .string()
    .required("validation.required")
    .matches(/^[0-9]+$/, "validation.invalidNationalId")
    .min(10, "validation.minLength")
    .max(20, "validation.maxLength"),

  dateOfBirth: yup
    .date()
    .required("validation.required")
    .test("is-past", "validation.dateInPast", isPastDate)
    .max(new Date(), "validation.dateInPast"),

  gender: yup
    .string()
    .required("validation.required")
    .oneOf(["male", "female", "other"], "validation.invalidGender"),

  address: yup
    .string()
    .required("validation.required")
    .min(5, "validation.minLength"),

  city: yup
    .string()
    .required("validation.required")
    .min(2, "validation.minLength"),

  state: yup
    .string()
    .required("validation.required")
    .min(2, "validation.minLength"),

  country: yup
    .string()
    .required("validation.required")
    .min(2, "validation.minLength"),

  phone: yup
    .string()
    .required("validation.required")
    .matches(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
      "validation.invalidPhone"
    ),

  email: yup
    .string()
    .required("validation.required")
    .email("validation.invalidEmail"),
});

// Step 2: Family & Financial Information validation schema
export const step2Schema = yup.object().shape({
  maritalStatus: yup
    .string()
    .required("validation.required")
    .oneOf(
      ["single", "married", "divorced", "widowed"],
      "validation.invalidMaritalStatus"
    ),

  dependents: yup
    .number()
    .required("validation.required")
    .min(0, "validation.nonNegative")
    .integer("validation.mustBeInteger"),

  employmentStatus: yup
    .string()
    .required("validation.required")
    .oneOf(
      ["employed", "unemployed", "selfEmployed", "retired"],
      "validation.invalidEmploymentStatus"
    ),

  monthlyIncome: yup
    .number()
    .required("validation.required")
    .min(0, "validation.nonNegative"),

  housingStatus: yup
    .string()
    .required("validation.required")
    .oneOf(
      ["owned", "rented", "homeless", "other"],
      "validation.invalidHousingStatus"
    ),
});

// Step 3: Situation Descriptions validation schema
export const step3Schema = yup.object().shape({
  financialSituation: yup
    .string()
    .required("validation.required")
    .min(50, "validation.minLength"),

  employmentCircumstances: yup
    .string()
    .required("validation.required")
    .min(50, "validation.minLength"),

  reasonForApplying: yup
    .string()
    .required("validation.required")
    .min(50, "validation.minLength"),
});

// Complete form validation schema (all steps combined)
export const completeFormSchema = yup.object().shape({
  ...step1Schema.fields,
  ...step2Schema.fields,
  ...step3Schema.fields,
});

// Helper function to get schema for a specific step
export const getSchemaForStep = (step: number): yup.AnyObjectSchema => {
  switch (step) {
    case 1:
      return step1Schema;
    case 2:
      return step2Schema;
    case 3:
      return step3Schema;
    default:
      return step1Schema;
  }
};
