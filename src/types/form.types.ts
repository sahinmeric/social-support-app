// Form data interface for the complete application
export interface ApplicationFormData {
  // Step 1: Personal Information
  name: string;
  nationalId: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other" | "";
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;

  // Step 2: Family & Financial Information
  maritalStatus: "single" | "married" | "divorced" | "widowed" | "";
  dependents: number | "";
  employmentStatus: "employed" | "unemployed" | "selfEmployed" | "retired" | "";
  monthlyIncome: number | "";
  currency: "USD" | "AED" | "";
  housingStatus: "owned" | "rented" | "homeless" | "other" | "";

  // Step 3: Situation Descriptions
  financialSituation: string;
  employmentCircumstances: string;
  reasonForApplying: string;
}

// Initial form data with empty values
export const initialFormData: ApplicationFormData = {
  name: "",
  nationalId: "",
  dateOfBirth: "",
  gender: "",
  address: "",
  city: "",
  state: "",
  country: "",
  phone: "",
  email: "",
  maritalStatus: "",
  dependents: "",
  employmentStatus: "",
  monthlyIncome: "",
  currency: "AED",
  housingStatus: "",
  financialSituation: "",
  employmentCircumstances: "",
  reasonForApplying: "",
};

// Form step type
export type FormStep = 1 | 2 | 3;

// Form validation errors
export interface FormErrors {
  [key: string]: string | undefined;
}
