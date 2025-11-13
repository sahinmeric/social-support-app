/**
 * API configuration and endpoint constants
 */

/**
 * API configuration
 */
export const API_CONFIG = {
  /** OpenAI API URL */
  OPENAI_URL: "https://api.openai.com/v1/chat/completions",
  /** Mock API delay (ms) */
  MOCK_API_DELAY: 1500,
  /** Request timeout (ms) */
  REQUEST_TIMEOUT: 30000,
  /** Default API base URL */
  BASE_URL: "/api",
} as const;

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  /** Submit application endpoint */
  SUBMIT_APPLICATION: "/api/applications",
  /** Validate national ID endpoint */
  VALIDATE_NATIONAL_ID: "/api/validate/national-id",
} as const;

/**
 * OpenAI configuration
 */
export const OPENAI_CONFIG = {
  /** Model to use for AI suggestions */
  MODEL: "gpt-3.5-turbo",
  /** Maximum tokens for AI response */
  MAX_TOKENS: 300,
  /** Temperature for AI response randomness */
  TEMPERATURE: 0.7,
  /** System role message */
  SYSTEM_MESSAGE:
    "You are a helpful assistant that helps people write clear and empathetic descriptions for social support applications.",
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
