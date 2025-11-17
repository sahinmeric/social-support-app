// Backend API request types
export interface AISuggestionRequest {
  fieldName: string;
  formData: {
    employmentStatus?:
      | "employed"
      | "unemployed"
      | "selfEmployed"
      | "retired"
      | "";
    monthlyIncome?: number | "";
    housingStatus?: "owned" | "rented" | "homeless" | "other" | "";
    dependents?: number | "";
    financialSituation?: string;
  };
}

// Backend API response types
export interface AISuggestionResponse {
  text: string;
  fieldName: string;
}

// AI suggestion result
export interface AISuggestion {
  text: string;
  fieldName: string;
}

// AI error types
export const AIErrorType = {
  NETWORK: "network",
  TIMEOUT: "timeout",
  RATE_LIMIT: "rateLimit",
  GENERIC: "generic",
} as const;

export type AIErrorType = (typeof AIErrorType)[keyof typeof AIErrorType];

export interface AIError {
  type: AIErrorType;
  message: string;
}
