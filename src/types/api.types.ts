/**
 * Generic API response wrapper
 */
export interface APIResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: APIError;
}

/**
 * API error structure
 */
export interface APIError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Submission response data
 */
export interface SubmissionData {
  applicationId: string;
  timestamp: string;
}

/**
 * Typed submission response
 */
export type SubmissionResponse = APIResponse<SubmissionData>;

/**
 * Validation error response
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validation errors response
 */
export interface ValidationErrorsResponse {
  errors: ValidationError[];
}
