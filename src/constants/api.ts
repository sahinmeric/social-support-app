/**
 * API configuration and endpoint constants
 */

/**
 * API configuration
 */
export const API_CONFIG = {
  /** Backend API base URL */
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "/api",
  /** Mock API delay (ms) */
  MOCK_API_DELAY: 1500,
  /** Request timeout (ms) */
  REQUEST_TIMEOUT: 30000,
} as const;

/**
 * API endpoints (relative paths, will be combined with BASE_URL)
 */
export const API_ENDPOINTS = {
  /** Submit application endpoint */
  SUBMIT_APPLICATION: "/applications",
  /** Validate national ID endpoint */
  VALIDATE_NATIONAL_ID: "/validate/national-id",
  /** AI suggestion endpoint */
  AI_SUGGESTIONS: "/ai/suggestions",
} as const;

/**
 * HTTP status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  RATE_LIMIT: 429,
  SERVER_ERROR: 500,
} as const;

/**
 * Axios error codes
 */
export const ERROR_CODES = {
  TIMEOUT: "ECONNABORTED",
  NETWORK_ERROR: "ETIMEDOUT",
} as const;
