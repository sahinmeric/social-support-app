import * as yup from "yup";
import {
  MIN_TEXT_LENGTH,
  MAX_TEXT_LENGTH,
  VALIDATION_PATTERNS,
  VALIDATION_MESSAGES,
} from "../constants/validation";

// Step 1: Personal Information validation schema
export const step1Schema = yup.object().shape({
  name: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .min(MIN_TEXT_LENGTH.NAME, VALIDATION_MESSAGES.MIN_LENGTH)
    .matches(VALIDATION_PATTERNS.NAME, VALIDATION_MESSAGES.INVALID_NAME),

  nationalId: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .matches(
      VALIDATION_PATTERNS.NATIONAL_ID,
      VALIDATION_MESSAGES.INVALID_NATIONAL_ID
    )
    .min(MIN_TEXT_LENGTH.NATIONAL_ID, VALIDATION_MESSAGES.MIN_LENGTH)
    .max(MAX_TEXT_LENGTH.NATIONAL_ID, VALIDATION_MESSAGES.MAX_LENGTH),

  dateOfBirth: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .test("is-valid-date", VALIDATION_MESSAGES.DATE_IN_PAST, (value) => {
      if (!value) return false;
      const date = new Date(value);
      return !isNaN(date.getTime()) && date < new Date();
    }),

  gender: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .oneOf(["male", "female", "other"], VALIDATION_MESSAGES.INVALID_GENDER),

  address: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .min(MIN_TEXT_LENGTH.ADDRESS, VALIDATION_MESSAGES.MIN_LENGTH),

  city: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .min(MIN_TEXT_LENGTH.CITY, VALIDATION_MESSAGES.MIN_LENGTH),

  state: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .min(MIN_TEXT_LENGTH.STATE, VALIDATION_MESSAGES.MIN_LENGTH),

  country: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .min(MIN_TEXT_LENGTH.COUNTRY, VALIDATION_MESSAGES.MIN_LENGTH),

  phone: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .matches(VALIDATION_PATTERNS.PHONE, VALIDATION_MESSAGES.INVALID_PHONE),

  email: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .email(VALIDATION_MESSAGES.INVALID_EMAIL),
});

// Step 2: Family & Financial Information validation schema
export const step2Schema = yup.object().shape({
  maritalStatus: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .oneOf(
      ["single", "married", "divorced", "widowed"],
      VALIDATION_MESSAGES.INVALID_MARITAL_STATUS
    ),

  dependents: yup
    .number()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .min(0, VALIDATION_MESSAGES.NON_NEGATIVE)
    .integer(VALIDATION_MESSAGES.MUST_BE_INTEGER),

  employmentStatus: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .oneOf(
      ["employed", "unemployed", "selfEmployed", "retired"],
      VALIDATION_MESSAGES.INVALID_EMPLOYMENT_STATUS
    ),

  monthlyIncome: yup
    .number()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .min(0, VALIDATION_MESSAGES.NON_NEGATIVE),

  housingStatus: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .oneOf(
      ["owned", "rented", "homeless", "other"],
      VALIDATION_MESSAGES.INVALID_HOUSING_STATUS
    ),
});

// Step 3: Situation Descriptions validation schema
export const step3Schema = yup.object().shape({
  financialSituation: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .min(MIN_TEXT_LENGTH.DESCRIPTION, VALIDATION_MESSAGES.MIN_LENGTH),

  employmentCircumstances: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .min(MIN_TEXT_LENGTH.DESCRIPTION, VALIDATION_MESSAGES.MIN_LENGTH),

  reasonForApplying: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .min(MIN_TEXT_LENGTH.DESCRIPTION, VALIDATION_MESSAGES.MIN_LENGTH),
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
